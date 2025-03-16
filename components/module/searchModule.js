async function runSearch(searchTerm) {
  const searchResults = await getSearchResults(searchTerm)
  $w('#resultRepeater').data = searchResults
}
function initSearchRepeater() {
  $w('#resultRepeater').onItemReady(($item, itemData) => {
    const { _id, title, type, path } = itemData
    $item('#resultTitle').text = title
    $w('#resultWrapper').show()
  })
}
export async function searchOnKeyPress(event) {
  console.log($w('#search').value)

  setTimeout(() => {
    if ($w('#search').value.length >= 1) {
      $w('#resetBtn').show()
      runSearch($w('#search').value)
    }
  }, 500)
}

export function resultBoxOnClick(event) {
  let repeaterId = event.target.parent.id
  let itemId = event.context.itemId
  let item = $w(`#${repeaterId}`).data.find((_) => _._id === itemId)
  // console.log(repeaterId);
  // console.log(itemId);
  // console.log(item);

  updateHistory(item)
  wixLocation.to(`/expertise/${item.path}`)
}

export function resetBtnOnClick(event) {
  $w('#search').value = ''
  $w('#resetBtn').hide()
  $w('#resultWrapper').hide()
  $w('#resultRepeater').data = []
}
// Code End

async function updateHistory(item) {
  let searchHistory = JSON.parse(local.getItem('searchHistory'))

  if (searchHistory !== null) {
    searchHistory.push({ _id: item._id, title: item.title, type: item.type, path: item.path })
    local.setItem('searchHistory', JSON.stringify(searchHistory))
    $w('#historyRepeater').data = searchHistory
  } else {
    let searches = []
    searches.push({ _id: item._id, title: item.title, type: item.type, path: item.path })
    local.setItem('searchHistory', JSON.stringify(searches))
    $w('#historyRepeater').data = searches
  }
}

function initSearchHistoryRepeater() {
  $w('#historyRepeater').onItemReady(($item, itemData) => {
    const { _id, title, type, path } = itemData
    $item('#currentSearch').text = title
    $w('#historyRepeater').show()
  })
}

function checkLocal() {
  let searchHistory = JSON.parse(local.getItem('searchHistory'))
  if (searchHistory !== null) {
    $w('#historyRepeater').data = searchHistory
  }
}
