/********************************
 * FIREBASE INIT
 *******************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { 
  getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, addDoc 
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqwVQx8NbHucvpYmftMG3uSsTFQ5WBWM0",
  authDomain: "soultabs-c814d.firebaseapp.com",
  projectId: "soultabs-c814d",
  storageBucket: "soultabs-c814d.firebasestorage.app",
  messagingSenderId: "51287038225",
  appId: "1:51287038225:web:f8afac352a833f362214b0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

/********************************
 * GLOBAL STATE
 *******************************/
let currentUser = null;
let currentEmotion = null;
let currentReason = null;
let verses = [];
let index = 0;

/********************************
 * DOM
 *******************************/
const startBtn = document.getElementById("startBtn");
const intro = document.getElementById("intro");
const userLabel = document.getElementById("userLabel");
const emotionsList = document.getElementById("emotions");
const contextTitle = document.getElementById("contextTitle");
const reasonButtons = document.getElementById("reasonButtons");
const verseText = document.getElementById("verseText");
const verseRef = document.getElementById("verseRef");
const verseCard = document.getElementById("verseCard");
const favPanel = document.getElementById("favoritesPanel");
const favList = document.getElementById("favList");

/********************************
 * AUTH
 *******************************/
startBtn.onclick = () => {
  intro.classList.add("fadeOut");
  setTimeout(loadEmotions, 600);
};

document.getElementById("authLine").innerHTML =
  `<br><button id='googleSignBtn'>Sign in with Google</button>`;

document.addEventListener("click", (e)=>{
  if (e.target.id==="googleSignBtn") signInWithPopup(auth,provider);
});

document.getElementById("favoritesBtn").onclick = () => {
  favPanel.style.display = "block";
  loadFavorites();
};
document.getElementById("closeFavs").onclick = () => favPanel.style.display="none";

onAuthStateChanged(auth, (user)=>{
  currentUser = user;
  userLabel.textContent = user ? `Welcome, ${user.displayName.split(" ")[0]}` : "Not signed in";
});

/********************************
 * LOAD EMOTIONS
 *******************************/
async function loadEmotions() {
  emotionsList.innerHTML = "<li>Loading...</li>";
  const snap = await getDocs(collection(db,"emotions"));
  emotionsList.innerHTML = "";
  snap.forEach(docSnap=>{
    const li = document.createElement("li");
    li.textContent = docSnap.id;
    li.onclick = ()=> selectEmotion(docSnap.id);
    emotionsList.appendChild(li);
  });
}

async function selectEmotion(emotion){
  currentEmotion = emotion;
  index = 0;
  contextTitle.textContent = emotion.toUpperCase();

  const snap = await getDocs(collection(db,`emotions/${emotion}/reasons`));
  reasonButtons.innerHTML = "";
  snap.forEach(r=>{
    const b = document.createElement("button");
    b.textContent = r.id;
    b.onclick = ()=> selectReason(r.id);
    reasonButtons.appendChild(b);
  });

  verseCard.style.display = "none";
}

async function selectReason(reason){
  currentReason = reason;
  const d = await getDoc(doc(db,`emotions/${currentEmotion}/reasons/${reason}`));
  verses = Array.isArray(d.data().verses) ? d.data().verses : d.data().verses.split("\n");
  index = 0;
  displayVerse();
}

function displayVerse(){
  const line = verses[index];
  const [text,ref] = line.includes("—") ? line.split("—") : [line,""];
  verseText.textContent = text.trim();
  verseRef.textContent = ref.trim();
  verseCard.style.display="block";
}

document.getElementById("nextBtn").onclick = ()=>{ index=(index+1)%verses.length; displayVerse(); };
document.getElementById("prevBtn").onclick = ()=>{ index=(index-1+verses.length)%verses.length; displayVerse(); };

/********************************
 * FAVORITES (SYNCED)
 *******************************/
document.getElementById("saveFavBtn").onclick = async ()=>{
  if (!currentUser) return alert("Sign in to save favorites");
  await addDoc(collection(db,`users/${currentUser.uid}/favorites`), {
    emotion: currentEmotion,
    reason: currentReason,
    verse: verses[index],
    ts: Date.now()
  });
  alert("Saved ❤️");
};

async function loadFavorites(){
  favList.innerHTML = "Loading...";
  if (!currentUser) return favList.innerHTML="Sign in to view favorites";
  
  const snap = await getDocs(collection(db,`users/${currentUser.uid}/favorites`));
  favList.innerHTML = "";
  snap.forEach(f=>{
    const li=document.createElement("li");
    li.textContent = f.data().verse;
    favList.appendChild(li);
  });
}

/********************************
 * MOOD LOG + STREAK
 *******************************/
document.getElementById("moodBtn").onclick = async ()=>{
  if (!currentUser) return alert("Sign in to log moods");
  const today = new Date().toISOString().split("T")[0];
  await setDoc(doc(db,`users/${currentUser.uid}/moods/${today}`), {
    emotion: currentEmotion,
    reason: currentReason,
    verse: verses[index],
    ts: Date.now()
  });
  incrementStreak();
  alert("Mood logged ✅");
};

async function incrementStreak(){
  if (!currentUser) return;
  const ref = doc(db,`users/${currentUser.uid}/streak/info`);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {count:0,last:""};
  const today = new Date().toISOString().split("T")[0];

  if (data.last !== today){
    await setDoc(ref,{
      count:data.count+1,
      last:today
    });
  }
}

/********************************
 * JOURNAL SYNC + EXPORT
 *******************************/
const journal = document.getElementById("journal");
journal.addEventListener("input", async ()=>{
  if (!currentUser) return;
  await setDoc(doc(db,`users/${currentUser.uid}/journal/entry`), {
    text: journal.value,
    ts: Date.now()
  });
});

document.getElementById("exportJournal").onclick = ()=>{
  const blob = new Blob([journal.value],{type:"text/plain"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="journal.txt";
  a.click();
};
