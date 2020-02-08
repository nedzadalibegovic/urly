let urls;

const makeRow = (rowID, element) => {
    return `
        <td>${element.title}</td>
        <td>${element.url}</td>
        <td class="text-right">
            <button type="button" class="btn btn-primary" data-toggle="tooltip" title="Last update: ${new Date(element.date).toLocaleString()}" data-placement="left" onclick="edit_modal(${rowID})">Edit</button>
        </td>`;
}

const getLinks = async () => {
    let response = await fetch('http://192.168.0.10:3000/api');
    urls = await response.json();

    for (let i = 0; i < urls.length; i++) {
        const element = urls[i];

        $('#append').append('<tr>' + makeRow(i, element) + '</tr>');
    }

    $('#urlCount').append(urls.length);

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
}

const edit_modal = rowID => {
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
        </div>`

    $('body').prepend(modal);
    $('#edit_modal').modal();

    $('#edit_modal').on('hidden.bs.modal', () => {
        $('#edit_modal').remove();
    });
}

const edit_tooltip_success = (json) => {
    const tooltip = `
        <div class="toast" data-delay="1000" role="alert" aria-live="assertive" aria-atomic="true" style="z-index: 100000000;">
            <div class="toast-header">
                <strong class="mr-auto">Urly: ${json.title}</strong>
            </div>
            <div class="toast-body">
                Successfuly updated!
            </div>
        </div>`;

    $('#toast-shelf').html(tooltip);

    $('.toast').toast('show');
    $('.toast').on('hidden.bs.toast', function () {
        $(this).remove();
    });
}

const edit_submit = async (rowID) => {
    const row = $('#append').children().eq(rowID);
    const data = {
        _id: $('#id').val(),
        title: $('#title').val(),
        url: $('#url').val()
    }

    try {
        let response = await fetch(`http://192.168.0.10:3000/api/${data._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let json = await response.json();

        // update data in global array
        urls[rowID] = json;

        // update modal
        $('#title').val(json.title);
        $('#url').val(json.url);
        $('#lastEdit').val(new Date(json.date).toLocaleString());

        // update row with new data
        row.html(makeRow(rowID, json));
        row.tooltip({
            selector: '[data-toggle="tooltip"]'
        });

        // show tooltip on success
        edit_tooltip_success(json);
    } catch (err) {
        console.error(err);
    }
}

getLinks();