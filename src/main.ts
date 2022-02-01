import * as ZXing from "@zxing/library";

async function main() {
  const codeReader = new ZXing.BrowserMultiFormatReader();
  const videoInputDevices = await codeReader.listVideoInputDevices();
  const selectedDeviceId =
    videoInputDevices[videoInputDevices.length - 1].deviceId;

  codeReader.decodeFromVideoDevice(selectedDeviceId, "video", (result) => {
    if (result) {
      navigator.vibrate(50);
      createAlert(result.getText());
    }
  });

  function createAlert(text: string) {
    fetch(`https://pubsub.rycont.ninja/pub/scanner/`, {
      method: "POST",
      body: JSON.stringify({
        data: text,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });

    const alertElement = document.createElement("div");
    alertElement.classList.add("alert");
    alertElement.appendChild(document.createTextNode(text));
    document.body.appendChild(alertElement);
    setTimeout(() => {
      alertElement.classList.add("disappear");
      setTimeout(() => {
        alertElement.remove();
      }, 1000);
    }, 1000);
  }
}

main();
