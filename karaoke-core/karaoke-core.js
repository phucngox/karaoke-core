    const wrapper = document.createElement('div');
    wrapper.id = 'karaoke-wrapper';
    wrapper.setAttribute('translate', 'no');
    wrapper.innerHTML = `<div id="karaoke-top"></div><div id="karaoke-bottom"></div>`;
    dp.container.appendChild(wrapper);

    const topEl = document.getElementById('karaoke-top');
    const bottomEl = document.getElementById('karaoke-bottom');

    function isJapanese(text) {
        return /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(text);
    }

    function isVietnamese(text) {
        return /[ăâđêôơưÁÀẢÃẠẮẰẲẴẶÂẦẤẨẪẬĐÊỀẾỂỄỆÔỒỐỔỖỘƠỜỚỞỠỢƯỪỨỬỮỰ]/iu.test(text);
    }

    function updateKaraoke(current) {
        const activeLines = karaokeData.filter(k => current >= k.start && current <= k.end);

        let topLine = null, bottomLine = null;

        if (activeLines.length >= 2) {
            const [lineA, lineB] = activeLines;
            const aText = cleanText(lineA.text);
            const bText = cleanText(lineB.text);

            const isAJP = isJapanese(aText);
            const isBJP = isJapanese(bText);
            const isAVN = isVietnamese(aText);
            const isBVN = isVietnamese(bText);

            if ((isAJP && isBVN) || (!isAJP && isBVN)) {
                topLine = lineA;
                bottomLine = lineB;
            } else if ((isBJP && isAVN) || (!isBJP && isAVN)) {
                topLine = lineB;
                bottomLine = lineA;
            } else if (!isAJP && !isBJP) {
                bottomLine = aText.length > bText.length ? lineA : lineB;
                topLine = aText.length > bText.length ? lineB : lineA;
            } else {
                bottomLine = lineA;
            }
        } else if (activeLines.length === 1) {
            const line = activeLines[0];
            const text = cleanText(line.text);
            const isJP = isJapanese(text);
            const isVN = isVietnamese(text);

            if (isJP || isVN) bottomLine = line;
            else topLine = line;
        }

        if (bottomLine && /^[\p{Script=Latin}\d\s.,'?!-]+$/u.test(bottomLine.text) && !isVietnamese(bottomLine.text)) {
            topLine = null;
        }

        if (topLine) {
            const progressTop = (current - topLine.start) / (topLine.end - topLine.start);
            topEl.innerHTML = highlightText(topLine.text, topLine.highlight, progressTop);
        } else {
            topEl.innerHTML = "";
        }

        if (bottomLine) {
            const progressBottom = (current - bottomLine.start) / (bottomLine.end - bottomLine.start);
            bottomEl.innerHTML = highlightText(bottomLine.text, bottomLine.highlight, progressBottom);
        } else {
            bottomEl.innerHTML = "";
        }
    }
    const karaokeWrapper = document.getElementById('karaoke-wrapper');