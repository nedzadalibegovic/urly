let urls;

const makeRow = (rowID, element) => {
    return `<td>${element.title}</td>
            <td>${element.url}</td>
            <td class="text-right">
                <button type="button" class="btn btn-primary" 
                data-toggle="tooltip" title="Last update: ${new Date(element.date).toLocaleString()}"
                data-placement="left" 
                onclick="modalEdit(${rowID})">Edit</button>
            </td>`
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

const modalEdit = rowID => {
    const url = urls[rowID];

    const modal = `
    <div class="modal fade" id="modalEdit" tabindex="-1" role="dialog" aria-labelledby="modalEditLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalEditLabel">${url.title}</h5>
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
                <button type="button" class="btn btn-primary" onclick="submitEdit(${rowID})">Save changes</button>
          </div>
        </div>
      </div>
    </div>`

    $('body').prepend(modal);
    $('#modalEdit').modal();

    $('#modalEdit').on('hidden.bs.modal', () => {
        $('#modalEdit').remove();
    });
}

const submitEdit = async (rowID) => {
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
    } catch (err) {
        console.error(err);
    }

    // $('#modalEdit').modal('hide');
}

getLinks();