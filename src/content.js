const observer = new MutationObserver(appendSearchbar);
observer.observe(document.body, { subtree: true, childList: true });
function appendSearchbar() {
    var _a, _b;
    const position = document.getElementById('repository-container-header');
    const resource = document.getElementById('ex-filter-group');
    const pathnames = window.location.pathname.split('/');
    // check url path
    if (pathnames.length < 3 || (!((_a = pathnames[3]) === null || _a === void 0 ? void 0 : _a.startsWith('pulls')) && !((_b = pathnames[3]) === null || _b === void 0 ? void 0 : _b.startsWith('issues')))) {
        // remove the added resource if at wrong location
        if (resource)
            resource.remove();
        return;
    }
    // Inject the resource to the target position if there isn't one
    if (position && !resource) {
        const html = `
        <div class="clearfix container-xl px-3 px-md-4 px-lg-5 mt-4" id="ex-filter-group">
    <div class="d-flex mb-2 flex-row">
        <div class="mr-3" id="ex-filter-group-type">
            <label for="ex-filter-type">Type</label>
            <select class="form-control" id="ex-filter-type" value="" style="appearance:none">
                <option>pr</option>
                <option>issue</option>
            </select>
        </div>
        <div class="mr-3" id="ex-filter-group-state">
            <label for="ex-filter-state">State</label>
            <select class="form-control" id="ex-filter-state" value="" style="appearance:none">
                <option>open</option>
                <option>closed</option>
            </select>
        </div>

        <div class="mr-1" id="ex-filter-group-keyword">
            <label for="ex-filter-keyword">Keyword</label>
            <input type="text" class="form-control" id="ex-filter-keyword" value="" placeholder="Type something">
        </div>

        <div class="mr-3" id="ex-filter-group-keyword-in">
            <label for="ex-filter-in">in</label>
            <select class="form-control" id="ex-filter-in" value="" style="appearance:none">
                <option>title</option>
                <option>body</option>
                <option>comments</option>
                <option>all place</option>
            </select>
        </div>

        <div class="mr-3" id="ex-filter-group-search-button">
            <button type="button" class="btn btn-primary" href="">Search</button>
        </div>
    </div>

    <div class="d-flex flex-row">
        <div class="mr-3" id="ex-filter-group-date">
            <label for="ex-filter-action">Date filter</label>
            <select class="form-control" id="ex-filter-action" value="" style="appearance:none">
                <option>created</option>
                <option>updated</option>
                <option>merged</option>
                <option>closed</option>
            </select>
            <select class="form-control" id="ex-filter-operator" value="" style="appearance:none">
                <option>at</option>
                <option>before</option>
                <option>after</option>
                <option>from</option>
            </select>
            <input type="date" class="form-control" id="ex-filter-date-1" value="" placeholder="YYYY-MM-DD">
            <label for="ex-filter-date-2" style="visibility:hidden">to</label>
            <input type="date" class="form-control" id="ex-filter-date-2" value="" placeholder="YYYY-MM-DD" style="visibility:hidden">
        </div>
    </div>
</div>
        `;
        position.insertAdjacentHTML("afterend", html);
        // Set visibility of the second date
        var dateTo = document.getElementById('ex-filter-date-2');
        document.getElementById('ex-filter-operator').addEventListener('change', function () {
            if (this.selectedIndex == 3) {
                // "from..to" is selected 
                dateTo.style.visibility = 'visible';
                dateTo.labels.forEach(value => value.style.visibility = 'visible');
            }
            else {
                dateTo.value = "";
                dateTo.style.visibility = 'hidden';
                dateTo.labels.forEach(value => value.style.visibility = 'hidden');
            }
        });
        // Enable search button
        document.getElementById('ex-filter-group-search-button').addEventListener('click', search);
    }
}
function search() {
    var type = document.getElementById('ex-filter-type');
    var state = document.getElementById('ex-filter-state').value;
    var keyword = document.getElementById('ex-filter-keyword').value;
    var keywordIn = document.getElementById('ex-filter-in').value;
    var action = document.getElementById('ex-filter-action').value;
    var operator = document.getElementById('ex-filter-operator');
    var dateFrom = document.getElementById('ex-filter-date-1').value;
    var dateTo = document.getElementById('ex-filter-date-2').value;
    var pathnames = window.location.pathname.split('/');
    var queryParams = [];
    queryParams.push(appendParam('is', type.value), appendParam('is', state), keyword, 
    // not to append if keyword is empty or no limit for the search
    appendParam('in', keywordIn == "all place" || !keyword ? "" : keywordIn), appendDateParam(action, operator, dateFrom, dateTo));
    const qType = type.selectedIndex == 0 ? 'pulls' : 'issues';
    const href = `https://github.com/${pathnames[1]}/${pathnames[2]}/${qType}?q=${queryParams.filter(v => v).join('+')}`;
    window.location.href = href;
}
function appendParam(qualifier, value) {
    if (value) {
        return `${qualifier}:${value}`;
    }
    else {
        return "";
    }
}
function appendDateParam(action, operator, from, to) {
    var selectedIdx = operator.selectedIndex;
    var operatorMap = new Map([
        [0, ""],
        [1, "<="],
        [2, ">="],
        [3, ".."]
    ]);
    if (selectedIdx == 3 && from && to) {
        // selected from..to
        return appendParam(action, `${from}${operatorMap.get(selectedIdx)}${to}`);
    }
    if (from) {
        // selected at/before/after
        return appendParam(action, `${operatorMap.get(selectedIdx)}${from}`);
    }
    return appendParam(action, "");
}
