const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

window.onresize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
};

// ================== BACKGROUND STARS ==================
let stars = [];
for (let i = 0; i < 150; i++) {
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
    let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) - Math.cos(4 * t);

    heart.push({
        x: canvas.width / 2 + x * 15,
        y: canvas.height / 2 - y * 15
    });
}

// ================== PARTICLE CLICK ==================
let particles = [];
canvas.addEventListener("click", e => {
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: e.clientX,
            y: e.clientY,
            dx: (Math.random()-0.5)*4,
            dy: (Math.random()-0.5)*4,
            life: 40
        });
    }
});

// ================== DRAW ==================
function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // stars
    stars.forEach((s,i)=>{
        ctx.fillStyle="white";
        ctx.fillRect(s.x,s.y,1.5,1.5);

        for(let j=i+1;j<stars.length;j++){
            let d = Math.hypot(s.x-stars[j].x, s.y-stars[j].y);
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

    // heart
    heart.forEach((p,i)=>{
        ctx.fillStyle="#7aa2ff";
        ctx.beginPath();
        ctx.arc(p.x,p.y,2,0,Math.PI*2);
        ctx.fill();

        if(i>0){
            ctx.strokeStyle="rgba(122,162,255,0.3)";
            ctx.beginPath();
            ctx.moveTo(heart[i-1].x,heart[i-1].y);
            ctx.lineTo(p.x,p.y);
            ctx.stroke();
        }
    });

    // particles
    particles.forEach((p,i)=>{
        ctx.fillStyle="white";
        ctx.fillRect(p.x,p.y,2,2);
        p.x+=p.dx;
        p.y+=p.dy;
        p.life--;
        if(p.life<=0) particles.splice(i,1);
    });

    requestAnimationFrame(animate);
}
animate();

// ================== TEXT & MUSIC ==================
const messages = [
    "Hi my love 💙",
    "I made this just for you",
    "No matter the distance",
    "You are always in my heart ❤️",
    "Love You Always ✨"
];

let index = 0;
const textEl = document.getElementById("text");
const btn = document.getElementById("btn");
const music = document.getElementById("music");

function typeText(text, i=0){
    if(i<=text.length){
        textEl.innerText = text.slice(0,i);
        setTimeout(()=>typeText(text,i+1),60);
    }
}

btn.onclick = () => {
    if(music.paused) music.play();
    typeText(messages[index]);
    index = (index + 1) % messages.length;
};
