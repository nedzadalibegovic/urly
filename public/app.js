const urls = new Array();
const apiUrl = 'http://192.168.0.10:3000/api/';
const redirectUrl = 'http://192.168.0.10:3000/';

const makeRow = (rowID, document) => {
    return `
        <tr id="url-${rowID}">
            <td>${document.title}</td>
            <td>${document.url}</td>
            <td class="text-right">
                <button type="button" class="btn btn-primary" data-toggle="tooltip" title="Last update: ${new Date(document.date).toLocaleString()}" data-placement="left" onclick="edit_generate_modal(${rowID})">Edit</button>
            </td>
        </tr>`;
}

const addToTable = (document) => {
    $('#append').append(makeRow(urls.length, document));
    $(`#url-${urls.length}`).tooltip({
        selector: '[data-toggle="tooltip"]'
    });
    urls.push(document);
    $('#total').text(urls.length);
}

const getLinks = async () => {
    const response = await fetch(apiUrl);
    const json = await response.json();

    for (const document of json) {
        addToTable(document);
    }
}

const edit_generate_modal = rowID => {
    const url = urls[rowID];

    const modal = `
        <div class="modal fade" id="edit_modal" tabindex="-1" role="dialog" aria-labelledby="edit_modalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="edit_modalLabel">${url.title}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="id">ID</label>
                                <input type="text" class="form-control" id="id" value="${url._id}" readonly>
                            </div>
                            <div class="form-group">
                                <label for="title">Title</label>
                                <input type="text" class="form-control" id="title" value="${url.title}">
                            </div>
                            <div class="form-group">
                                <label for="url">URL</label>
                                <input type="text" class="form-control" id="url" value="${url.url}">
                            </div>
                            <div class="form-group">
                                <label for="lastEdit">Last edit</label>
                                <input type="text" class="form-control" id="lastEdit" value="${new Date(url.date).toLocaleString()}" readonly>
                            </div>
                        </form>
                        </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="edit_submit(${rowID})">Save changes</button>
                    </div>
                </div>
            </div>
        </div>`;

    $('body').append(modal);

    $('#edit_modal').modal();
    $('#edit_modal').on('hidden.bs.modal', () => {
        $('#edit_modal').remove();
    });
}

const createTooltip = (title, message) => {
    const tooltip = `
        <div class="toast" data-delay="1500" role="alert" aria-live="assertive" aria-atomic="true" style="z-index: 100000000;">
            <div class="toast-header">
                <strong class="mr-auto">Urly: ${title}</strong>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>`;

    $('#toast-shelf').html(tooltip);

    $('.toast').toast('show');
    $('.toast').on('hidden.bs.toast', function () {
        $(this).remove();
    });
}

const edit_submit = async (rowID) => {
    const data = {
        _id: $('#id').val(),
        title: $('#title').val(),
        url: $('#url').val()
    }

    const response = await fetch(`${apiUrl}${data._id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const json = await response.json();

    // update data in global array
    urls[rowID] = json;

    // update modal
    $('#title').val(json.title);
    $('#url').val(json.url);
    $('#lastEdit').val(new Date(json.date).toLocaleString());

    // update row with new data
    $(`#url-${rowID}`).replaceWith(makeRow(rowID, json));
    $(`#url-${rowID}`).tooltip({
        selector: '[data-toggle="tooltip"]'
    });

    // show tooltip on success
    createTooltip(json._id, `${json.title} successfully updated!`);
}

const getSiteTitle = async (url) => {
    const response = await fetch('https://cors-anywhere.herokuapp.com/' + url);

    if (response.status !== 200) {
        return null;
    }

    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const title = doc.querySelectorAll('title')[0];

    return title.innerText;
}

// https://mathiasbynens.be/demo/url-regex - @diegoperini
const create_validateURL = (url) => {
    const re_weburl = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

    return re_weburl.test(url);
}

const create_input_check = async () => {
    const input = $('#long-url').val();

    // check if input is syntactically valid
    if (create_validateURL(input) === false) {
        $('#long-url').removeClass('is-valid').addClass('is-invalid');
        $('#next').prop('disabled', true);
        $('.invalid-feedback').text('Please provide a valid url');
        $('.invalid-feedback').css('display', 'block');
        return;
    }

    const title = await getSiteTitle(input);

    // check if URL is reachable
    if (title === null) {
        $('#long-url').removeClass('is-valid').addClass('is-invalid');
        $('#next').prop('disabled', true);
        $('.invalid-feedback').text('Please provide a reachable url');
        $('.invalid-feedback').css('display', 'block');
        return;
    }

    $('#long-url').removeClass('is-invalid').addClass('is-valid');
    $('#title').val(title);
    $('#next').prop('disabled', false);
    $('.invalid-feedback').css('display', 'none');
}

const create_generate_modal = () => {
    const carousel = `
        <div id="create_carousel" class="carousel slide d-flex" data-wrap="false" data-interval="false" data-ride="carousel" style="min-height: 100px;">
            <div class="carousel-inner d-flex align-items-center">
                <div id="long-url-crsl" class="carousel-item active text-center">
                    <label for="long-url">Long URL goes down here.</label>
                        <div class="input-group">
                            <input type="url" class="form-control m-2" id="long-url" required>
                        </div>
                        <div class="invalid-feedback"></div>
                </div>
                <div id="title-crsl" class="carousel-item text-center">
                    <label for="title">What shall be the title?</label>
                    <div class="input-group">
                        <input type="text" class="form-control m-2" id="title">
                    </div>
                </div>
                <div id="short-url-crsl" class="carousel-item text-center"></div>
            </div>
        </div>`;

    const modal = `
        <div class="modal fade" id="create_modal" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="create_modalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="create_modalLabel">Let's shorten your URL!</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${carousel}
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="next" class="btn btn-outline-dark" href="#create_carousel" role="button" data-slide="next" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>`;

    $('body').append(modal);

    $('#create_modal').modal();
    $('#create_modal').on('hidden.bs.modal', () => {
        $('#create_modal').remove();
    });

    // https://stackoverflow.com/a/5926782
    let typingTimer;
    let doneTypingInterval = 200;

    // URL validation
    $('#long-url').keyup(() => {
        clearTimeout(typingTimer);

        if ($('#long-url').val()) {
            typingTimer = setTimeout(create_input_check, doneTypingInterval);
        }
    });

    $('#next').click(async () => {
        if ($('#title-crsl').hasClass('active')) {
            await create_POST();
            $('#short-url-crsl').html(`<a href="${redirectUrl}${urls[urls.length - 1]._id}">${redirectUrl}${urls[urls.length - 1]._id}</a>`);
        }
    });
}

const create_POST = async () => {
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: $('#title').val(),
            url: $('#long-url').val()
        })
    });
    const json = await response.json();

    addToTable(json);
    createTooltip(json._id, `${json.title} has been shortened!`);
}

getLinks();