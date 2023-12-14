export function splice(str, addString, idx) {
  return str.slice(0, idx) + addString + str.slice(idx)
}

export function copyToClipboard(clickableText, target, targetDesc) {
  clickableText.onClick(() => {
    wixWindowFrontend.copyToClipboard(target.text).then(() => {
      clickableText.text = '(복사 성공!)'
      setTimeout(function () {
        clickableText.text = `(클릭 시 ${targetDesc} 복사)`
      }, 500)
    })
  })
}

export function replaceMulCharInString(_string, _charToReplace, _replaceWith, _tracerKey) {
  for (let i = 0; i < _charToReplace.length; i++) {
    if (_replaceWith[i] !== '' && _charToReplace[i] === _tracerKey) {
      _string = _string.replace(new RegExp(`{${_charToReplace[i]}}`, 'gi'), `<span class="variable" style="color:#ffffff;font-weight:bold;text-decoration:underline;background-color:#8C53A0">${_replaceWith[i]}</span>`)
    } else if (_replaceWith[i] !== '' && _charToReplace[i] !== _tracerKey) {
      _string = _string.replace(new RegExp(`{${_charToReplace[i]}}`, 'gi'), `<span class="drafted" style="color:#000000;background-color:#D4BCDC">${_replaceWith[i]}</span>`)
    }
  }
  return _string
}

export function removeHighlight(_string, _charToReplace, _replaceWith, _tracerKey) {
  for (let i = 0; i < _charToReplace.length; i++) {
    if (_replaceWith[i] !== '') {
      _string = _string.replace(new RegExp(`{${_charToReplace[i]}}`, 'gi'), `<span id="span_${_tracerKey}" style="color:#000000;background-color:#D4BCDC">${_replaceWith[i]}</span>`)
    }
  }
  return _string
}
