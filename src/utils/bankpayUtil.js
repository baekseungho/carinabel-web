export function openBankPayWallet(urlData, tid) {
    const width = 700;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open("", "BankPayPopup", `width=${width},height=${height},left=${left},top=${top}`);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = urlData.url;
    form.target = "BankPayPopup";

    for (const key in urlData) {
        if (key !== "url") {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = urlData[key];
            form.appendChild(input);
        }
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    // 팝업 감시
    const check = setInterval(() => {
        if (popup.closed) {
            clearInterval(check);
            checkPaymentResult(tid); // 외부에서 import 해도 가능
        }
    }, 1000);
}
