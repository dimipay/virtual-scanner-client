import * as ZXing from "@zxing/library";

const codeReader = new ZXing.BrowserMultiFormatReader();
const videoInputDevices = await codeReader.listVideoInputDevices();
const selectedDeviceId =
  videoInputDevices[videoInputDevices.length - 1].deviceId;

const socket = new WebSocket("ws://socketmirror.rycont.ninja");

codeReader.decodeFromVideoDevice(selectedDeviceId, "video", (result) => {
  if (result) {
    console.log("ABB");
    createAlert(result.getText());
  }
});

function createAlert(text: string) {
  socket.send(
    JSON.stringify({
      type: "scanned",
      data: text,
    })
  );

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
