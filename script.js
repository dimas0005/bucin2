const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const textEl = document.getElementById("text");
const music = document.getElementById("music");

function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ================== STARS ==================
let stars = [];
for (let i = 0; i < 160; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3
    });
}

// ================== HEART CONSTELLATION ==================
let heart = [];
for (let t = 0; t < Math.PI * 2; t += 0.15) {
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = 13 * Math.cos(t)
          - 5 * Math.cos(2 * t)
          - 2 * Math.cos(3 * t)
          - Math.cos(4 * t);

    heart.push({
        x: canvas.width / 2 + x * 15,
        y: canvas.height / 2 - y * 15
    });
}

// ================== FLOATING HEARTS ==================
let floatingHearts = [];
setInterval(() => {
    floatingHearts.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 20,
        size: Math.random() * 6 + 4,
        speed: Math.random() * 0.6 + 0.3,
        alpha: 1
    });
}, 1200);

// ================== SHOOTING STARS ==================
let shootingStars = [];
setInterval(() => {
    shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height / 2,
        dx: 8,
        dy: 4,
        life: 30
    });
}, 5000);

// ================== PARTICLES ==================
let particles = [];
canvas.addEventListener("click", e => {
    for (let i = 0; i < 25; i++) {
        particles.push({
            x: e.clientX,
            y: e.clientY,
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4,
            life: 40
        });
    }
});

canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    canvas.click();
});

// ================== DRAW ==================
function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    stars.forEach((s,i)=>{
        ctx.fillStyle="white";
        ctx.fillRect(s.x,s.y,1.5,1.5);

        for(let j=i+1;j<stars.length;j++){
            let d=Math.hypot(s.x-stars[j].x,s.y-stars[j].y);
            if(d<120){
                ctx.strokeStyle="rgba(255,255,255,0.08)";
                ctx.beginPath();
                ctx.moveTo(s.x,s.y);
                ctx.lineTo(stars[j].x,stars[j].y);
                ctx.stroke();
            }
        }

        s.x+=s.dx; s.y+=s.dy;
        if(s.x<0||s.x>canvas.width) s.dx*=-1;
        if(s.y<0||s.y>canvas.height) s.dy*=-1;
    });

    heart.forEach((p,i)=>{
        ctx.fillStyle="#7aa2ff";
        ctx.beginPath();
        ctx.arc(p.x,p.y,2,0,Math.PI*2);
        ctx.fill();
        if(i>0){
            ctx.strokeStyle="rgba(122,162,255,0.35)";
            ctx.beginPath();
            ctx.moveTo(heart[i-1].x,heart[i-1].y);
            ctx.lineTo(p.x,p.y);
            ctx.stroke();
        }
    });

    floatingHearts.forEach((h,i)=>{
        ctx.fillStyle=`rgba(255,150,200,${h.alpha})`;
        ctx.beginPath();
        ctx.arc(h.x,h.y,h.size,0,Math.PI*2);
        ctx.fill();
        h.y-=h.speed;
        h.alpha-=0.002;
        if(h.alpha<=0) floatingHearts.splice(i,1);
    });

    shootingStars.forEach((s,i)=>{
        ctx.strokeStyle="rgba(255,255,255,0.8)";
        ctx.beginPath();
        ctx.moveTo(s.x,s.y);
        ctx.lineTo(s.x-s.dx*2,s.y-s.dy*2);
        ctx.stroke();
        s.x+=s.dx; s.y+=s.dy; s.life--;
        if(s.life<=0) shootingStars.splice(i,1);
    });

    particles.forEach((p,i)=>{
        ctx.fillStyle="white";
        ctx.fillRect(p.x,p.y,2,2);
        p.x+=p.dx; p.y+=p.dy; p.life--;
        if(p.life<=0) particles.splice(i,1);
    });

    requestAnimationFrame(animate);
}
animate();

// ================== TEXT (HALUS, NO KEDIP) ==================
const messages = [
    "Halloo elek 💙",
    "Mungkin kita sama-sama capek, sama-sama keras kepala",
    "Aku ingin kita pelan-pelan belajar memahami, bukan saling menjauh",
    "perasaanku ke kamu nggak berubah.",
    "Kalau kamu mau, ayo kita benahi bersama.❤️",
    "Aku masih di sini, dan aku masih ingin kamu. ✨"
];

let index = 0;
let typing = false;
let charIndex = 0;
let currentText = "";

function startTyping(text) {
    typing = true;
    charIndex = 0;
    currentText = text;
    textEl.innerText = "";
    textEl.style.opacity = 0;

    setTimeout(() => {
        textEl.style.opacity = 1;
        typeLoop();
    }, 250);
}

function typeLoop() {
    if (charIndex <= currentText.length) {
        textEl.innerText = currentText.slice(0, charIndex);
        charIndex++;
        setTimeout(typeLoop, 55);
    } else {
        typing = false;
    }
}

canvas.addEventListener("click", () => {
    if (typing) return;
    if (music.paused) music.play();

    startTyping(messages[index]);
    if (index < messages.length - 1) index++;
});
