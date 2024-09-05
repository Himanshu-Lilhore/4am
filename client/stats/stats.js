let table = document.querySelector('#table');
const binIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>`

function cellWidth(key) {
    let widthCls = 'w-36'
    switch (key) {
        case '_id': widthCls = 'w-64';
            break;
        case 'vidNum': widthCls = 'w-24';
            break;
        case 'size': widthCls = 'w-28';
            break;
        case 'duration': widthCls = 'w-28';
            break;
        case 'likes': widthCls = 'w-16';
            break;
        case 'views': widthCls = 'w-20';
            break;
        case 'createdAt': widthCls = 'w-56';
            break;
        case 'updatedAt': widthCls = 'w-56';
            break;
        default: widthCls = 'w-64';
    }
    return widthCls
}

function view(data) {
    console.log('viewing all data... ')
    const dataArray = Array.isArray(data) ? data : [data];
    let tempRow, tempCell, currID
    dataArray.forEach((rowData, index) => {
        tempRow = document.createElement("div");
        tempRow.classList.add("flex", "flex-row", 'table-row', 'py-5', 'items-center');
        if (index === 0) {
            for (let key in rowData) {
                if (key === '__v' || key === 'createdAt' || key === 'updatedAt') continue
                tempCell = document.createElement("div");
                tempCell.classList.add('px-3', 'table-cell', 'border', `${cellWidth(key)}`)
                tempCell.textContent = key
                tempRow.appendChild(tempCell)
            }
            table.appendChild(tempRow)
            tempRow = document.createElement("div");
            tempRow.classList.add("flex", "flex-row", 'table-row', 'py-5', 'items-center');
        }
        for (let key in rowData) {
            if (key === '__v' || key === 'createdAt' || key === 'updatedAt') continue
            if (key === '_id') currID = rowData[key]
            tempCell = document.createElement("div");
            tempCell.classList.add('px-3', 'table-cell', `${cellWidth(key)}`)
            tempCell.textContent = rowData[key]
            tempRow.appendChild(tempCell)
        }

        tempDelBtn = document.createElement("div");
        tempDelBtn.classList.add('table-cell', 'w-6', 'inline', 'content-center')
        tempDelBtn.innerHTML = binIcon
        tempDelBtn.addEventListener('click', (function(id, row) {
            return function() {
                deleteRecord(id);
                table.removeChild(row)
            };
        })(currID, tempRow))
        tempRow.appendChild(tempDelBtn)
        table.appendChild(tempRow)
    })
}


function fetchAllData() {
    console.log("fetching all data...")
    fetch('https://4am-xi.vercel.app/meta/show-all', {
    // fetch('http://localhost:3000/meta/show-all', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            view(data)
        })
        .catch(error => {
            console.error('Problem fetching all records', error);
        });
}

function deleteRecord(id) {
    fetch('https://4am-xi.vercel.app/meta/delete', {
    // fetch('http://localhost:3000/meta/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            _id: id
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete record');
            }
            return response.json();
        })
        .then(data => {
            console.log("deleted this record successfully : " + data)
        })
        .catch(error => {
            console.error('Problem deleting the record:', error);
        });
}

fetchAllData()