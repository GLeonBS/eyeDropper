export const EyeDropperApplication = () => {

    const chooseButton = document.querySelector<HTMLButtonElement>('.choose-button')!
    const errorMessage = document.querySelector<HTMLSpanElement>('.error')!
    const currentColors = document.querySelectorAll<HTMLDivElement>('.cor')!
    const titles = document.querySelectorAll<HTMLTitleElement>('.cor-title')!
    const corAtual = document.getElementById('cor-atual')!
    const corAnterior = document.getElementById('cor-anterior')!
    const rgbAtual = document.getElementById('rgb-atual')!
    const rgbAnterior = document.getElementById('rgb-anterior')!
    const corTitle = document.getElementById('title-cores')!
    let ant = localStorage.getItem('corAnterior')!
    let ultimaCor = localStorage.getItem('corSelecionada')!
    console.log(corTitle);
    const btnLimpa = document.getElementById('btn-limpa')!

    if (!window.EyeDropper) {
        errorMessage.style.display = 'block'
        errorMessage.innerText =
            "Error: Seu navegador ainda não suporta a aplicação :/";
        corTitle.style.display = "none"

    }

    function clearColors() {
        currentColors.forEach(data => data.style.display = 'none')
        titles.forEach(data => data.style.display = 'none')
    }
    function showColors() {
        currentColors.forEach(data => data.style.display = 'flex')
        titles.forEach(data => data.style.display = 'block')
    }

    if (!localStorage.getItem('corSelecionada')) {
        corTitle.innerText = "Ainda não tem nenhuma cor selecionada :/"
        clearColors()
    } else {
        corTitle.innerText = "Cores:"
        showColors()
        corAtual.style.backgroundColor = ultimaCor
        rgbAtual.innerText = ultimaCor
        corAnterior.style.backgroundColor = ant
        rgbAnterior.innerText = ant
    }

    chooseButton.addEventListener('click', ev => {

        ev.preventDefault()
        const dropper = new EyeDropper();

        dropper
            .open()
            .then((result) => {
                corAtual.style.backgroundColor = result.sRGBHex
                if (localStorage.getItem('corSelecionada')) {
                    localStorage.setItem('corAnterior', ultimaCor)!
                    ant = localStorage.getItem('corAnterior')!
                    corAnterior.style.backgroundColor = ant
                    rgbAnterior.innerText = ant
                }
                localStorage.setItem('corSelecionada', result.sRGBHex)
                rgbAtual.innerText = result.sRGBHex
                corTitle.innerText = "Cores:"
                showColors()
                ultimaCor = localStorage.getItem('corSelecionada')!
            })
            .catch((e) => {
                errorMessage.style.display = 'block'
                errorMessage.innerText = " ", e
            })


    })

    btnLimpa.addEventListener('click', ev => {
        ev.preventDefault()
        if (localStorage.getItem('corAnterior') === null && localStorage.getItem('corSelecionada') === null) {
            corTitle.innerText = "Você não tem cores para apagar ヾ( ･`⌓´･)ﾉﾞ"
        } else {
            corTitle.innerText = "Você apagou as cores :/"
        }
        localStorage.removeItem('corAnterior')
        localStorage.removeItem('corSelecionada')

        corAnterior.style.backgroundColor = 'transparent'
        rgbAnterior.innerText = ""
        clearColors()
    })

}