function generateCard() {
    let name=document.getElementById("name").value;
    let id=document.getElementById("id").value;
    let dept = document.getElementById("dept").value;

    document.getElementById("showName").innerText= "Name:" + name;
    document.getElementById("showId").innerText="ID:"+id;
    document.getElementById("showDept").innerText="Department" + dept;

    let qrData =` Name: name, ID:{id} , Dept:${dept}`;

    QRCode.toCanvas(document.getElementById("qrCanvas"),qrData,function(error) {
        if(error)console.error(error);
        console.log("QR Code Generated!");
    })
}