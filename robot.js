let bluetoothDevice = null;
let bluetoothCharacteristic = null;

async function connect() {
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ name: "RobotCar_Web" }]
        });

        document.getElementById("status").textContent = "جاري الاتصال...";

        const server = await device.gatt.connect();
        const service = await server.getPrimaryService("6E400001-B5A3-F393-E0A9-E50E24DCCA9E");
        bluetoothCharacteristic = await service.getCharacteristic("6E400002-B5A3-F393-E0A9-E50E24DCCA9E");

        bluetoothDevice = device;
        document.getElementById("status").textContent = "تم الاتصال بنجاح!";
        console.log("Connected to RobotCar_Web");
    } catch (error) {
        console.error("Connection failed:", error);
        alert("فشل الاتصال: " + error.message);
    }
}

async function sendCommand(command) {
    if (!bluetoothCharacteristic) {
        alert("لم تكن هناك اتصال. اضغط على 'اتصال' أولًا.");
        return;
    }

    try {
        await bluetoothCharacteristic.writeValue(new TextEncoder().encode(command));
        console.log("Command sent:", command);
    } catch (error) {
        console.error("Failed to send command:", error);
        alert("فشل الإرسال: " + error.message);
    }
}

// تشغيل الاتصال عند الضغط على زر
window.onload = () => {
    const connectBtn = document.createElement("button");
    connectBtn.textContent = "اتصال";
    connectBtn.style.fontSize = "18px";
    connectBtn.style.padding = "10px 20px";
    connectBtn.style.margin = "10px auto";
    connectBtn.onclick = connect;
    document.body.appendChild(connectBtn);
};
