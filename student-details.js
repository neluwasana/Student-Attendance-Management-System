let students = JSON.parse(localStorage.getItem("students") || "[]");
let editingIndex = -1;

function showForm() {
  document.getElementById("studentForm").style.display = "block";
  document.getElementById("studentForm").reset();
  editingIndex = -1;
}

function saveStudent(event) {
  event.preventDefault();
  const form = event.target;
  const newStudent = {
    name: form.name.value,
    fatherName: form.fatherName.value,
    studentId:
      editingIndex === -1 ? Date.now() : students[editingIndex].studentId,
    email: form.email.value,
    gender: form.gender.value,
    contact: form.contact.value,
    motherName: form.motherName.value,
    nic: form.nic.value,
    course: form.course.value,
    dob: form.dob.value,
  };
  if (editingIndex === -1) {
    students.push(newStudent);
  } else {
    students[editingIndex] = newStudent;
  }
  localStorage.setItem("students", JSON.stringify(students));
  renderTable();
  form.reset();
  form.style.display = "none";
}

function renderTable(filtered = students) {
  const table = document.getElementById("studentTable");
  table.innerHTML = "";
  filtered.forEach((student, index) => {
    const row = `<tr>
          <td>${student.name}</td>
          <td>${student.fatherName}</td>
          <td>${student.studentId}</td>
          <td>${student.email}</td>
          <td>${student.gender}</td>
          <td>${student.contact}</td>
          <td>${student.motherName}</td>
          <td>${student.nic}</td>
          <td>${student.course}</td>
          <td>${student.dob}</td>
          <td class="actions">
            <button class="Edit-btn" onclick="editStudent(${index})">Edit</button>
            <button class="Delete-btn" onclick="deleteStudent(${index})">Delete</button>
          </td>
        </tr>`;
    table.innerHTML += row;
  });
}

function editStudent(index) {
  const student = students[index];
  const form = document.getElementById("studentForm");
  form.name.value = student.name;
  form.fatherName.value = student.fatherName;
  form.email.value = student.email;
  form.gender.value = student.gender;
  form.contact.value = student.contact;
  form.motherName.value = student.motherName;
  form.nic.value = student.nic;
  form.course.value = student.course;
  form.dob.value = student.dob;
  form.style.display = "block";
  editingIndex = index;
}

function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this student?")) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    renderTable();
  }
}

document.getElementById("searchBar").addEventListener("input", function () {
  const value = this.value.toLowerCase();
  const filtered = students.filter((s) =>
    Object.values(s).some((v) => String(v).toLowerCase().includes(value))
  );
  renderTable(filtered);
});

function printStudent() {
  const value = document.getElementById("searchBar").value.toLowerCase();
  const found = students.find((s) =>
    Object.values(s).some((v) => String(v).toLowerCase().includes(value))
  );
  if (found) {
    const win = window.open("", "", "width=800,height=600");
    win.document.write("<h1>Student Details</h1>");
    Object.entries(found).forEach(([key, val]) => {
      win.document.write(`<p><strong>${key}</strong>: ${val}</p>`);
    });
    win.print();
  } else {
    alert("No matching student found to print.");
  }
}

renderTable();

function closeForgotPassword() {
  window.location.href = "Cards.html";
}
