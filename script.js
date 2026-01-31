document.addEventListener("DOMContentLoaded", () => {

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const textEl = document.getElementById("text");
const music = document.getElementById("music");

// ================== RESIZE ==================
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ================== STARS ==================
let stars = [];
for (let i = 0; i < 120; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3
    });
}

// ================== HEART ==================
let heart = [];
for (let t = 0; t < Math.PI * 2; t += 0.2) {
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = 13 * Math.cos(t)
          - 5 * Math.cos(2*t)
          - 2 * Math.cos(3*t)
          - Math.cos(4*t);
    heart.push({
        x: canvas.width / 2 + x * 12,
        y: canvas.height / 2 - y * 12
    });
}

// ================== DRAW ==================
function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // stars
    stars.forEach(s=>{
        ctx.fillStyle = "white";
        ctx.fillRect(s.x,s.y,1.5,1.5);
        s.x+=s.dx; s.y+=s.dy;
        if(s.x<0||s.x>canvas.width) s.dx*=-1;
        if(s.y<0||s.y>canvas.height) s.dy*=-1;
    });

    // heart
    heart.forEach(p=>{
        ctx.fillStyle="#7aa2ff";
        ctx.beginPath();
        ctx.arc(p.x,p.y,2,0,Math.PI*2);
        ctx.fill();
    });

    requestAnimationFrame(animate);
}
animate();

// ================== TEXT ==================
const messages = [
    "Halo kamu 💙",
    "Aku tau kita lagi nggak baik-baik aja",
    "Aku cuma mau bilang…",
    "Aku masih peduli",
    "Dan masih milih kamu",
    "Kalau kamu mau ngobrol",
    "Aku selalu ada",
    "❤️"
];

let index = 0;
let typing = false;

function typeText(text, i=0){
    typing = true;
    textEl.style.opacity = 1;
    textEl.innerText = text.slice(0,i);
    if(i < text.length){
        setTimeout(()=>typeText(text,i+1),60);
    } else {
        typing = false;
    }
}

// click anywhere
canvas.addEventListener("click", ()=>{
    if(typing) return;
    if(music && music.paused) music.play().catch(()=>{});
    typeText(messages[index]);
    if(index < messages.length-1) index++;
});

// mobile
canvas.addEventListener("touchstart", e=>{
    e.preventDefault();
    canvas.click();
});

});
