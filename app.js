// app.js (module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot, deleteDoc,
  doc, updateDoc, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* -----------------------
  PLACEHOLDER: Firebase config
  You MUST replace the object below with your project's config
  (get it from Firebase Console -> Project settings -> SDK setup)
------------------------*/
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANlkmwUPPT1ZOKSyZdXrDZkPvBbZbQ52g",
  authDomain: "todocloud-b8cb3.firebaseapp.com",
  projectId: "todocloud-b8cb3",
  storageBucket: "todocloud-b8cb3.firebasestorage.app",
  messagingSenderId: "369970028487",
  appId: "1:369970028487:web:dbc32d9b37dc2b840d03e2",
  measurementId: "G-0WE2L10GQQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tasksCol = collection(db, "tasks");

// UI refs
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Add task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  await addDoc(tasksCol, {
    text,
    completed: false,
    createdAt: serverTimestamp()
  });
  taskInput.value = "";
});

// Real-time listener (ordered by createdAt)
const q = query(tasksCol, orderBy("createdAt"));
onSnapshot(q, (snapshot) => {
  taskList.innerHTML = "";
  snapshot.forEach(docSnap => {
    const id = docSnap.id;
    const data = docSnap.data();
    const li = document.createElement("li");

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";

    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.checked = !!data.completed;
    toggle.addEventListener("change", async () => {
      await updateDoc(doc(db, "tasks", id), { completed: toggle.checked });
    });

    const span = document.createElement("span");
    span.className = "taskText" + (data.completed ? " completed" : "");
    span.textContent = data.text;

    left.appendChild(toggle);
    left.appendChild(span);

    const actions = document.createElement("div");
    actions.className = "actions";

    const del = document.createElement("button");
    del.className = "smallBtn";
    del.textContent = "Delete";
    del.addEventListener("click", async () => {
      await deleteDoc(doc(db, "tasks", id));
    });

    actions.appendChild(del);

    li.appendChild(left);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
});

