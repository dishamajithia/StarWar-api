//store fetched data in array
var loadedData = [];
var page = 1;
//dynamic list li generating for search result
function generateListItem(item, idx) {
    function createAttribute(label, value) {
        return $(`<span>`).addClass('P-10 M-5').text(`${label}: ${value}`);
    };
    const labelMap = {
        height: 'Height',
        mass: 'Mass',
        hair_color: 'Hair Color',
        skin_color: 'Skin Color',
        eye_color: 'Eye Color',
        birth_year: 'Birth Year',
        gender: 'Gender'
    };
    const listItem = $('<li>').addClass('list-item people w-50 m-auto');
    const container = $('<div>').addClass('P-10 M-5');
    const title = $('<div>').addClass('title');
    const collapseLink = $('<a>', {
        'data-target': `#item${idx}`,
        'data-toggle': 'collapse'
    });
    const titleHeader = $('<h2>').addClass('name').text(`${item.name}`)
    titleHeader.text(item.name);
    collapseLink.append(titleHeader)
    title.append(collapseLink);
    container.append(title)
    listItem.append(container);

    const collapsibleContent = $('<div>', {
        class: 'collapse-item content-wrap collapse',
        id: `item${idx}`
    });
    const content = $('<div>', {
        class: 'content'
    });
    for (const prop in labelMap) {
        const label = labelMap[prop];
        const attrItem = createAttribute(label, item[prop]);
        content.append(attrItem);
    }
    collapsibleContent.append(content);
    container.append(collapsibleContent);
    return listItem;
}
//populate data from api
function loadData(data) {
    const list = $('#list');
    data.forEach((item, idx) => {
        const listItem = generateListItem(item, idx);
        list.append(listItem);
    });
}
//fetch data from api 
function getdata(pagenumber) {
    console.log(pagenumber)
    //loadedData = [];
    //Create the XHR Object
    let xhr = new XMLHttpRequest;

    //Call the open function, GET-type of request, url, true-asynchronous
    xhr.open('GET', 'https://swapi.co/api/people/?page=' + pagenumber, true)
    //call the onload
    xhr.onload = function () {
        //check if the status is 200(means everything is okay)
        if (this.status === 200) {
            $(".loadMore").css("display", "block");
            const data = JSON.parse(this.responseText);
            loadedData.push(...data.results);
            loadData(data.results)
            if (data.next) {
                page += 1;
            } else {
                $(".loadMore").hide()
            }
        }
    }
    //call send
    xhr.send();

}

$(document).ready(function () {
    $(".loadMore").on("click", function () {
        getdata(page);
    })

    getdata(page);
    //search data
    $("#searchid").keyup(function () {
        var filter = $(this).val();
        $(".search-view-wrapper .search-list ul li h2").each(function () {

            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).closest(".people").addClass("d-none");

            } else {
                $(this).closest(".people").removeClass("d-none");
                $(this).show();

            }
            $("#peopletemplate").addClass("d-none");
        });
    });
});