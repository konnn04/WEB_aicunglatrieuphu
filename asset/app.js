window.onload = ()=>{
    const AUDIO = {
        m_intro:new Audio("./asset/audio/Intro_2021.mp3"),
        m_q1_5:new Audio("./asset/audio/Q1_5.ogg"),
        m_q6_10:new Audio("./asset/audio/C6-10.ogg"),
        m_q11_15:new Audio("./asset/audio/C11-15.ogg"),
        s_q1_5_c: new Audio("./asset/audio/C1-5_Dung.ogg"),
        s_q1_5_w: new Audio("./asset/audio/C1-5_Sai.ogg"),
        s_5050: new Audio("./asset/audio/5050.ogg"),
        s_q1_5_f: new Audio("./asset/audio/C5_Qua.ogg"),
        s_q6_10_fa: new Audio("./asset/audio/C6-10-fa.ogg"),
        s_q6_10_c: new Audio("./asset/audio/C6-10_Dung.ogg"),
        s_q6_10_w: new Audio("./asset/audio/C6-10_Sai.ogg"),
        s_q6_10_f: new Audio("./asset/audio/C6-10_f.ogg"),
        s_q11_15_fa: new Audio("./asset/audio/C11-15-fa.ogg"),
        s_q11_15_c: new Audio("./asset/audio/C11-15_Dung.ogg"),
        s_q11_15_w: new Audio("./asset/audio/C11-15_Sai.ogg"),
        s_q11_15_f: new Audio("./asset/audio/C11-15_f.ogg"),
        s_ready0: new Audio("./asset/audio/Before_100.mp3"),
        s_ready: new Audio("./asset/audio/Ready.ogg"),
        s_ready2: new Audio("./asset/audio/Ready2.ogg"),
        s_voted: new Audio("./asset/audio/Ask_the_Audience_Result.ogg"),
        m_calling: new Audio("./asset/audio/Phone_a_Friend_Ready.ogg"),
        m_ring: new Audio("./asset/audio/ringing_phone-mike_koenig-1503628110.mp3"),
        s_bip: new Audio("./asset/audio/bip.mp3"),
        s_dis: new Audio("./asset/audio/disconnect.mp3"),
    }
    const DOM = {
        body : document.body,
        main : document.body.querySelector("main"),
        bg:document.getElementById("bg"),
        sence:{}
        
    }
    const CONFIG = {
        current : 0,
        pause : false,
        selected : -1,
        helper:[true,true,true,true],
        a:null,
        music:null,
        wait : false,
        checkpoint:[],
        firstFocus:false
    }
    PlayIntro(DOM,CONFIG)

    document.body.onclick = ()=>{
        if (!CONFIG.firstFocus) {
            CONFIG.firstFocus = true
            playSound(AUDIO.m_intro,0,null,false,0.6)
            $("#bg video").play()
        }else{
            PlayFirstStage(DOM, AUDIO, CONFIG)   
            stopSound(AUDIO.m_intro)
            playSound(AUDIO.s_ready0,0,null,false,0.6)
            document.body.onclick = null
        }
    }
    // 
}

function PlayIntro(DOM) {
    DOM.main.innerHTML = HOME
    DOM.bg.innerHTML = `<video src="./asset/video/vid.mp4" autoplay loop></video>`
}

document.TIMER = {
    time:[],
    itv:[],
    main:null
}

function PlayFirstStage(DOM, AUDIO, CONFIG) {
    DOM.bg.innerHTML = `<img src="./asset/img/326.jpg" alt="" srcset="">`
    DOM.main.innerHTML = GAMEPLAY
    countdown(3)
    setTimeout(()=>{
        playSound(AUDIO.m_q1_5,0,null,true,.5)
        CONFIG.music = AUDIO.m_q1_5
        // pauseFirstStage(DATA,CONFIG,AUDIO)
        // pauseSecondStage(DATA,CONFIG,AUDIO)
        importFirstContent(DATA,CONFIG,AUDIO)
        initEventGame(CONFIG,AUDIO)
    },3000)
}

function importFirstContent(DATA,CONFIG,AUDIO) {
    //reset
    $("#helper3").removeClass("show")

    let DATA2 = mergeQuestion(DATA[CONFIG.current],CONFIG.current)
    CONFIG.a = DATA2.p

    if (CONFIG.current >=5) {
        pauseFirstStage(DATA,CONFIG,AUDIO)
        return
    }
    
    CONFIG.checkpoint[CONFIG.current] = -1 * (Date.now() / 1000)
    let count = 30
    $("#timer").text(count)

    document.TIMER.itv[CONFIG.current] = setInterval(()=>{
        if (CONFIG.pause) return
        count--;
        $("#timer").text(count)
    },1000)

    $("#answers").removeClass("block")
    showQuestion(DATA2)
    
    CONFIG.timer = Date.now()
    document.TIMER.main = setInterval(()=>{
        if (CONFIG.pause) return
        if (CONFIG.checkpoint[CONFIG.current] + Date.now()/1000 >=30) {
            showAnswer(false,CONFIG.a,-1)
            playSound(AUDIO.s_q1_5_w,0.2,null,false,.6)
            stopSound(AUDIO.m_q1_5)
            gameOver(CONFIG)
            clearInterval(document.TIMER.main)
            clearInterval(document.TIMER.itv[CONFIG.current])
        }


        if (CONFIG.selected>=0) {
            clearInterval(document.TIMER.main)
            clearInterval(document.TIMER.itv[CONFIG.current])
            CONFIG.checkpoint[CONFIG.current]+=(Date.now() / 1000)    
            setTimeout(()=>{
                if (CONFIG.selected == CONFIG.a) {
                    showAnswer(true,CONFIG.a,-1)
                    playSound(AUDIO.s_q1_5_c,0.2,null,false,.6)                

                    CONFIG.current++
                    console.log(CONFIG.checkpoint)
                    setTimeout(()=>{
                        resetQuestion(CONFIG)
                        CONFIG.selected = -1
                        importFirstContent(DATA,CONFIG,AUDIO)
                    },1000)
                }else{
                    showAnswer(false,CONFIG.a,CONFIG.selected)
                    playSound(AUDIO.s_q1_5_w,0.2,null,false,.6)
                    stopSound(AUDIO.m_q1_5)
                    gameOver(CONFIG)
                }
            },1000)
        }
    },100)
}

function PlaySecordStage(DATA,CONFIG,AUDIO) {
    countdown(5)
    setTimeout(()=>{
        stopSound(AUDIO.s_ready)
        importSecondContent(DATA,CONFIG,AUDIO)
    },5000)
    $("#gameplay").removeClass("show-level")
}

function PlayLastStage(DATA,CONFIG,AUDIO) {
    $("#gameplay").removeClass("show-level")
    countdown(5)
    setTimeout(()=>{
        stopSound(AUDIO.s_ready2)
        importLastContent(DATA,CONFIG,AUDIO)
    },5000)
    
}

function importSecondContent(DATA,CONFIG,AUDIO) {
    //reset
    $("#helper3").removeClass("show")

    let DATA2 = mergeQuestion(DATA[CONFIG.current],CONFIG.current)
    CONFIG.a = DATA2.p
    if (CONFIG.current >=10) {
        pauseSecondStage(DATA,CONFIG,AUDIO)
        return
    }
    CONFIG.music = AUDIO.m_q6_10
    playSound(AUDIO.m_q6_10,0,null,false,.4)

    CONFIG.checkpoint[CONFIG.current] = -1 * (Date.now() / 1000)
    let count = 60
    $("#timer").text(count)

    document.TIMER.itv[CONFIG.current] = setInterval(()=>{
        if (CONFIG.pause) return
        count--;
        $("#timer").text(count)
    },1000)

    $("#answers").removeClass("block")
    showQuestion(DATA2)
    
    CONFIG.timer = Date.now()
    document.TIMER.main = setInterval(()=>{
        if (CONFIG.pause) return
        if (CONFIG.checkpoint[CONFIG.current] + Date.now()/1000 >=60) {
            showAnswer(false,CONFIG.a,null,-1)
            playSound(AUDIO.s_q6_10_w,0.2,null,false,.6)
            stopSound(AUDIO.m_q6_10)
            gameOver(CONFIG)
            clearInterval(document.TIMER.main)
            clearInterval(document.TIMER.itv[CONFIG.current])
        }


        if (CONFIG.selected>=0) {
            clearInterval(document.TIMER.main)
            clearInterval(document.TIMER.itv[CONFIG.current])
            CONFIG.checkpoint[CONFIG.current]+=(Date.now() / 1000)    

            playSound(AUDIO.s_q6_10_fa,0,null,false,.6)
            stopSound(AUDIO.m_q6_10)

            setTimeout(()=>{
                if (CONFIG.selected == CONFIG.a) {
                    showAnswer(true,CONFIG.a)
                    if (CONFIG.current == 9) {
                        playSound(AUDIO.s_q6_10_f,0.2,null,false,.6)   
                    }else{
                        playSound(AUDIO.s_q6_10_c,0.2,null,false,.6)   
                    }
                    stopSound(AUDIO.s_q6_10_fa)
                    CONFIG.current++
                    console.log(CONFIG.checkpoint)
                    setTimeout(()=>{
                        resetQuestion(CONFIG)
                        CONFIG.selected = -1
                        importSecondContent(DATA,CONFIG,AUDIO)
                    },3000)
                }else{
                    showAnswer(false,CONFIG.a,CONFIG.selected,-1)
                    playSound(AUDIO.s_q6_10_w,0.2,null,false,.6)
                    stopSound(AUDIO.s_q6_10_fa)
                    gameOver(CONFIG)
                }
            },3000)
        }
    },100)
}

function importLastContent(DATA,CONFIG,AUDIO) {
    //reset
    $("#helper3").removeClass("show")

    if (CONFIG.current >=15) {
        pauseLastStage(DATA,CONFIG,AUDIO)
        return
    }

    let DATA2 = mergeQuestion(DATA[CONFIG.current],CONFIG.current)
    CONFIG.a = DATA2.p

    

    CONFIG.music = AUDIO.m_q11_15
    playSound(AUDIO.m_q11_15,0,null,false,.4)

    CONFIG.checkpoint[CONFIG.current] = -1 * (Date.now() / 1000)
    let count = 60
    $("#timer").text(count)

    document.TIMER.itv[CONFIG.current] = setInterval(()=>{
        if (CONFIG.pause) return
        count--;
        $("#timer").text(count)
    },1000)

    $("#answers").removeClass("block")
    showQuestion(DATA2)
    
    CONFIG.timer = Date.now()
    document.TIMER.main = setInterval(()=>{
        if (CONFIG.pause) return
        if (CONFIG.checkpoint[CONFIG.current] + Date.now()/1000 >=60) {
            showAnswer(false,CONFIG.a,null)
            playSound(AUDIO.s_q11_15_w,0.2,null,false,.6)
            stopSound(AUDIO.m_q11_15)
            gameOver(CONFIG)
            clearInterval(document.TIMER.main)
            clearInterval(document.TIMER.itv[CONFIG.current])
        }


        if (CONFIG.selected>=0) {
            clearInterval(document.TIMER.main)
            clearInterval(document.TIMER.itv[CONFIG.current])
            CONFIG.checkpoint[CONFIG.current]+=(Date.now() / 1000)    

            playSound(AUDIO.s_q11_15_fa,0,null,false,.6)
            stopSound(AUDIO.m_q11_15)
            let w = (CONFIG.current == 14)?7000:4000;
            setTimeout(()=>{
                if (CONFIG.selected == CONFIG.a) {
                    showAnswer(true,CONFIG.a)
                    if (CONFIG.current == 14) {
                        playSound(AUDIO.s_q11_15_f,0.2,null,false,.6)   
                    }else{
                        playSound(AUDIO.s_q11_15_c,0.2,null,false,.6)   
                    }
                    stopSound(AUDIO.s_q11_15_fa)
                    CONFIG.current++
                    console.log(CONFIG.checkpoint)
                    setTimeout(()=>{
                        resetQuestion(CONFIG)
                        CONFIG.selected = -1
                        importLastContent(DATA,CONFIG,AUDIO)
                    },3000)
                }else{
                    showAnswer(false,CONFIG.a,CONFIG.selected,-1)
                    playSound(AUDIO.s_q11_15_w,0.2,null,false,.6)
                    stopSound(AUDIO.s_q11_15_fa)
                    gameOver(CONFIG)
                }
            },w)
        }
    },100)
}

function pauseLastStage(DATA,CONFIG,AUDIO) {
    $("#gameplay").addClass("show-level")
    $("#current-level div p ").text("150.000.000d")
    $("#ask").hide();
    let s = 0
    CONFIG.checkpoint.forEach((e,i)=>{
        s+=e
    })
    s = s.toFixed(2)
    setTimeout(()=>{
        $("main").html(WIN.replace("#time",s + " giây"))
        $("#bg").html(`<video src="./asset/video/Here comes the money - meme.mp4" loop autoplay muted></video> `)
    },3000)
}

const WIN = `
    <div id="win">
        <h1>BẠN ĐÃ TRỞ THÀNH TỈ PHÚ</h1>
        <h3>Bạn đã ẳm về 150.000.000đ</h3>
        <p>Thời gian để thành tỉ phú: #time</p>
    </div>
`

function pauseSecondStage(DATA,CONFIG,AUDIO) {
    $("#gameplay").addClass("show-level")
    $("#current-level div p ").text("20.000.000d")
    
}

function pauseFirstStage(DATA,CONFIG,AUDIO) {
    playSound(AUDIO.s_q1_5_f,0,null,false,.5)
    stopSound(AUDIO.m_q1_5)
    $("#gameplay").addClass("show-level")
    $("#current-level div p ").text("5.000.000d")
    $("#helper .item").eq(3).removeClass("hidden")
    
}

function initEventGame(CONFIG,AUDIO){
    $("#answers .ans").each((i,e)=>{ 
        $(e).on("click",function(){
            if ($(e).hasClass("hidden")) return
            CONFIG.wait = true
            $(e).addClass("selected")
            CONFIG.selected = i
            CONFIG.timer = Date.now() - CONFIG.timer
            $("#answers").addClass("block")
        })
    });
    $("#helper .item").eq(0).on("click",()=>{
        helper5050(CONFIG,AUDIO)
    })

    $("#helper .item").eq(1).on("click",()=>{
        helperCalling(CONFIG,AUDIO)
    })

    $("#helper .item").eq(2).on("click",()=>{
        helperVoted(CONFIG,AUDIO)
    })

    $("#helper .item").eq(3).on("click",()=>{
        
    })

    $("#ask .confirm:nth-child(2)").on("click",()=>{
        if (CONFIG.current >= 5 && CONFIG.current <= 9) {
            PlaySecordStage(DATA,CONFIG,AUDIO)
            stopSound(AUDIO.s_q1_5_f)
            playSound(AUDIO.s_ready,0,null,false,.5)
            return
        }
        if (CONFIG.current >= 10 && CONFIG.current <= 15) {
            PlayLastStage(DATA,CONFIG,AUDIO)
            stopSound(AUDIO.s_q6_10_f)
            playSound(AUDIO.s_ready2,0,null,false,.5)
        }
    })
}

const DATA = [
    {
        q:"Tiến trình là gì?",
        a:["Là một chương trình đang được thực thi","Là một tập tin được lưu trữ trên đĩa","Là một thiết bị ngoại vi","Là một phần của CPU"]
    },
    {
        q:"Hệ điều hành nào sau đây <b>không</b> thuộc hệ điều hành cho thiết bị di động",
        a:["iOS","Linux","Android","Windows Phone"]
    },{
        q:"Thành phần nào không thuộc phần cứng máy tính?",
        a:["CPU","RAM","Hệ điều hành","BIOS"]
    },
    {
        q:"Chức năng cơ bản của máy tính bao gồm những gì?",
        a:["Xử lý dữ liệu.","Lưu trữ dữ liệu.","Di chuyển dữ liệu.","3 phương án điều đúng"]
    },
    {
        q:"Hệ điều hành là gì?",
        a:["Một chương trình/hệ chương trình hoạt động giữa người sử dụng và phần cứng của máy tính.","Một chương trình giúp người sử dụng chơi game.","Một chương trình giúp người sử dụng soạn thảo văn bản.","Một chương trình giúp người sử dụng lướt web."]
    },
    {
        q:"Máy tính thế hệ nào sử dụng đèn điện tử chân không?",
        a:["Thế hệ 2 (1955 - 1965)","Thế hệ 1 (1945 - 1955)","Thế hệ 3 (1965 - 1980)","Thế hệ 4 (từ 1980)"]
    },{
        q:"Hệ điều hành phân tán là gì?",
        a:["Hệ điều hành cho phép chia sẻ tài nguyên giữa các máy tính.",". Hệ điều hành cho phép quản lý và điều khiển các thiết bị mạng.","Hệ điều hành cho phép phân chia các chức năng của hệ điều hành trên nhiều máy tính.","3 phương án còn lại điều đúng"]
    },
    {
        q:"Monitor bao gồm những thành phần nào?",
        a:["Một hoặc nhiều thủ tục (procedure).","Một đoạn code khởi tạo (initialization code).","Các biến dữ liệu cục bộ (local data variable).","3 phương án còn lại điều đúng"]
    },{
        q:"Khi tiến trình yêu cầu tài nguyên, điều gì sẽ xảy ra nếu tài nguyên không có sẵn?",
        a:["Tiến trình sẽ chuyển sang trạng thái chờ.","Tiến trình sẽ bị kết thúc.","Tiến trình sẽ tiếp tục thực thi.","Hệ thống sẽ bị lỗi."]
    },
    {
        q:"Loại màn hình nào phổ biến nhất hiện nay?",
        a:["CRT","LCD","LED","OLED"]
    },{
        q:"Hệ điều hành có vai trò gì trong việc quản lý tài nguyên hệ thống?",
        a:["Giúp người sử dụng dễ dàng sử dụng các tài nguyên hệ thống.","Giúp máy tính chạy nhanh hơn.","Giúp các chương trình có thể hoạt động chính xác và hiệu quả.","Giúp máy tính tiết kiệm năng lượng."]
    },
    {
        q:"PCB đóng vai trò gì trong hệ điều hành?",
        a:["Giúp hệ điều hành lập lịch và điều phối các tiến trình","Giúp hệ điều hành theo dõi và kiểm soát việc sử dụng tài nguyên của các tiến trình","Cho phép hệ điều hành xử lý các yêu cầu I/O của các tiến trình","3 phương án còn lại điều đúng"]
    },{
        q:"Semaphore có liên quan gì đến đa luồng?",
        a:["Semaphore có thể được sử dụng để đồng bộ hóa các luồng.","Semaphore không liên quan đến đa luồng.","Semaphore là một dạng đa luồng.",". Semaphore là một thư viện cung cấp các hàm để tạo và sử dụng đa luồng."]
    },
    {
        q:"Biến điều kiện (condition variable) là gì?",
        a:["Là một biến được sử dụng để đồng bộ hóa truy cập vào tài nguyên chung.","Là một biến được sử dụng để kiểm tra điều kiện trước khi thực hiện một hành động.","Là một biến được sử dụng để đánh thức một tiến trình đang bị khóa.","Là một biến được sử dụng để đưa một tiến trình vào hàng đợi."]
    },{
        q:"Tình trạng giữ và đợi (hold and wait) là gì?",
        a:["Khi một tiến trình yêu cầu tài nguyên đang được sử dụng bởi một tiến trình khác.","Khi hai tiến trình yêu cầu cùng một tài nguyên.","Khi một tiến trình đang giữ một tài nguyên và chờ một tài nguyên khác đang được giữ bởi một tiến trình khác.","Khi hệ thống không có đủ tài nguyên cho các tiến trình."]
    }
]
//class="show-level"
const HOME = `
<div id="home">
    <div class="logo">
        <img src="./asset/img/AiLaPhu.png" alt="" srcset="">
    </div>
    <p>Nhấn để chơi</p>
</div>
`

const CONTACT = [
    {
        "name":"Sơn Tùng M-TP",
        "img":"https://i1.sndcdn.com/artworks-i0nLuYBs0dR2nsn4-AkxVlg-t500x500.jpg",
        "chat":["Alo em, gọi anh có việc gì vậy?","Tham gia Ai là Phú sao, thích thế","Với câu hỏi này, anh nghĩ là dapan, chắc là thế!","Okay bye em nhá! Chúc em thi tốt!"],
    },
    {
        "name":"Mr Beast",
        "img":"https://pbs.twimg.com/profile_images/994592419705274369/RLplF55e_400x400.jpg",
        "chat":["Bro!!! Gọi tôi có việc gì thế!","Ai là Phú sao? Nghe có vẻ thú dị đó","Để xem nào... Đáp án chính xác là dapan đó, Bro!", "Được rồi, thi tốt nhá, không có giải thì về đây tôi cho anh vài chục ngàn đô đỡ buồn. Hẹn gặp lại!"],
    },
    {
        "name":"Kanade Yoisaki",
        "img":"https://pm1.aminoapps.com/8535/02417aa66909219aade68e9ec165544bbe8c8c87r1-736-736v2_hq.jpg",
        "chat":["Ơ...Tớ đang viết nhạc...","Kanade cũng không rõ... E-tou...","Mafuyu bảo là dapan đấy! Cậu thử xem sao...","Hmm..chúc cậu may mắn!"],
    }
]

const GAMEPLAY = `
<div id="gameplay" >
<div id="countdown">
    <p></p>
</div>
<!-- <div id="rank">
    <i class="fa-solid fa-ranking-star"></i>
    <span>10th</span>
</div> -->

<div id="current-level">
    <div id="rank-box">
        <ul>
            <li></li>
        </ul>
    </div>
    <div class="score">
        <p>1.000.000</p>
    </div>
    <div id="ask">
        <div class="confirm">
            Dừng lại
        </div>
        <div class="confirm">
            Tiếp tục
        </div>
    </div>
</div>
<div id="flashback">

</div>
<div id="helper">
    <div class="item">
        <p style="font-weight: 800;">50:50</p>
    </div>
    <div class="item">
        <i class="fa-solid fa-phone"></i>
    </div>
    <div class="item">
    <i class="fa-solid fa-chart-simple"></i>
    </div>
    <div class="item hidden">
        <i class="fa-solid fa-graduation-cap"></i>
    </div>
</div>
<div id="helper3">
    <div class="box">
        <div class="col">
            <p></p>
            <div></div>
            <span>A</span>
        </div>
        <div class="col">
            <p></p>
            <div></div>
            <span>B</span>
        </div>
        <div class="col">
            <p></p>
            <div></div>
            <span>C</span>
        </div>
        <div class="col">
            <p></p>
            <div></div>
            <span>D</span>
        </div>
    </div>
    <p>Khảo sát ý kiến khán giả</p>
</div>

<div id="helper2" class="hidden">
    
</div>

<div id="qa">
    <div id="timer">
        60
    </div>
    <div id="question">
        <div class="content">
            <p>
                
            </p>
        </div>
    </div>
    <div id="answers" >
        <div class="ans">
            <p>
                
            </p>
        </div>
        <div class="ans">
            <p></p>
        </div>
        <div class="ans">
            <p></p>
        </div>
        <div class="ans">
           <p>
            
           </p>
        </div>
    </div>
</div>
</div>
`

function PHONE_CONTENT (contacts) {
    let time = new Date().toLocaleTimeString()
    time = time.substring(0,time.indexOf(":")+3)
    let list = ""
    contacts.forEach((e,i)=>{
        list +=`
            <li>
                <div class="img">        
                    <img src="${e.img}" alt="" srcset="">
                </div>
                <div class="name">
                    ${e.name}
                </div>
            </li>
        `
    })
    return `
<div class="phone">
    <div class="chat">
        <p></p>
    </div>
    <div class="top">
        <span>${time}</span>
        <div>
            <i class="fa-solid fa-wifi"></i>
            <i class="fa-solid fa-battery-full"></i>
        </div>
    </div>
    <div class="sence1">
        <div class="header">Danh bạ</div>
        <ul>
            ${list}
        </ul>
    </div>
    <div class="sence2">
        <div class="info">
            <div class="img">        
            <img src="" alt="" srcset="">
            </div>
            <span>Đang gọi...</span>
            <p></p>
            <h>0192837465</h>
        </div>
        <div class="ctrl">
            <div>
                <i class="fa-solid fa-microphone-slash"></i>
                <span>Tắt tiếng</span>
            </div>
            <div>
            <i class="fa-solid fa-hashtag"></i>
                <span>Bàn phím</span>
            </div>
            <div>
                <i class="fa-solid fa-volume-low"></i>
                <span>Loa</span>
            </div>
            <div>
                <i class="fa-solid fa-phone"></i>
                <span>Gọi thêm</span>
            </div>
        </div>
        <div class="end">
            <div>
                <i class="fa-solid fa-phone-slash"></i>
            </div>
        </div>
    </div>
   
    </div>
    `
}

function playSound(audio,start,end,loop,vol) {
    if (!end) end = audio.duration
    audio.id = (Math.floor(Date.now()/1000) % 999999).toString()
    audio.volume  = vol;
    audio.currentTime = start;
    audio.play();
    if (!loop) return;
    document.TIMER[audio.id] = setInterval(()=>{
        if (audio.currentTime + .05 >= Math.min(audio.duration,end)) {
            audio.currentTime = start;
            audio.play();
        }
    },50)
}


function stopSound(audio) {
    audio.pause();
    if (document.TIMER[audio.id] ) {
        clearInterval(document.TIMER[audio.id])
    }
}

function showQuestion(data) {
    $("#question .content p").text(data.q)
    $("#answers .ans:nth-child(1) p").text("A. "+data.a[0])
    $("#answers .ans:nth-child(2) p").text("B. "+data.a[1])
    $("#answers .ans:nth-child(3) p").text("C. "+data.a[2])
    $("#answers .ans:nth-child(4) p").text("D. "+data.a[3]) 
}

function showAnswer(status,correct,wrong) {
    $(`#answers .ans:nth-child(${correct+1})`).removeClass("selected")
    $(`#answers .ans:nth-child(${correct+1})`).addClass("correct")
    if (!status && wrong>-1) {
        $(`#answers .ans:nth-child(${wrong+1})`).removeClass("selected")
        $(`#answers .ans:nth-child(${wrong+1})`).addClass("wrong")
    }
    $(`#answers .ans`).each(function (index, element) {
        if (!(index == correct || index == wrong)) 
            $(element).addClass("hidden")     
    });
    
}

function resetQuestion(CONFIG) {
    $(`#answers .ans`).each(function (index, element) {
        $(element).removeClass("wrong")
        $(element).removeClass("correct")        
        $(element).removeClass("hidden")        
    });
    CONFIG.wait = false

}


function helper5050(CONFIG,AUDIO) {
    if (!CONFIG.helper[0] || CONFIG.wait) return
    let k = []
    while (k.length<2) {
        let m = Math.floor(Math.random()*4)
        if (!k.includes(m) && m != CONFIG.a) {
            k.push(m)
        }
    }
    $(`#answers .ans:nth-child(${k[0]+1})`).addClass("hidden")
    $(`#answers .ans:nth-child(${k[1]+1})`).addClass("hidden")
    CONFIG.helper[0] = false
    $("#helper .item").eq(0).addClass("remove")
    playSound(AUDIO.s_5050,0,null,false,.6)
}

function helperVoted(CONFIG,AUDIO) {
    if (!CONFIG.helper[2] || CONFIG.wait) return
    playSound(AUDIO.s_voted,0,null,false,.6)
    $("#helper3").addClass("show")
    let a = [0,0,0,0]
    let r = 100;
    a[CONFIG.a] = Math.floor(Math.random()*60 + 40)
    r -= a[CONFIG.a]
    for (let i=0;i<4;i++) {
        if (i == CONFIG.a) continue
        a[i] = Math.floor(Math.random()*r)
        r-=a[i]
    }
    a.forEach((e,i)=>{
        $(`#helper3 .col:nth-child(${i+1}) div`).css({"height":e*0.8+"%"})
        $(`#helper3 .col:nth-child(${i+1}) p`).text(e + "%")
    })
    CONFIG.helper[2] = false
    $("#helper .item").eq(2).addClass("remove")
}

function helperCalling(CONFIG,AUDIO) {
    playSound(AUDIO.s_bip,0,null,false,1)
    if (!CONFIG.helper[1] || CONFIG.wait ) return
    CONFIG.music.pause()
    playSound(AUDIO.m_calling,0,null,false,.5)
    CONFIG.pause = true
    CONFIG.checkpoint[CONFIG.current] += Date.now()/1000
    $("#helper2").removeClass("hidden")
    $("#helper2").html(PHONE_CONTENT(CONTACT))

    $("#helper2 ul li").each((index,element)=>{
        $(element).on("click",()=>{
            playSound(AUDIO.s_bip,0,null,false,1)
            $("#helper2 .sence2 .info img").attr("src",CONTACT[index].img)
            $("#helper2 .sence2 .info p").text(CONTACT[index].name)
            $("#helper2 .phone").addClass("active")
            setTimeout(()=>{playSound(AUDIO.m_ring,0,null,true,.4)},1000)
            setTimeout(()=>{
                runScriptCalling(index,CONFIG,AUDIO)
                stopSound(AUDIO.m_ring)
            },5000)
        })
                
    })
    
    CONFIG.helper[1] = false
    $("#helper .item").eq(1).addClass("remove")
}

function runScriptCalling(index,CONFIG,AUDIO){
    $("#helper2 .info span").text("00:00")
    let t = 0
    let calling = true
    $("#helper2 .end div").on("click",()=>{
        if (!calling) return
        calling = false
        playSound(AUDIO.s_dis,0,null,false,0.6)
        $("#helper2").removeClass("chat")
        clearInterval(document.TIMER.call)
        $("#helper2 .info span").text("Kết thúc")
        setTimeout(()=>{                
            stopSound(AUDIO.m_calling)
            CONFIG.music.play()
            CONFIG.checkpoint[CONFIG.current] -=Date.now() / 1000
            CONFIG.pause = false
            $("#helper2").addClass("hidden")
        },3000)
    })

    document.TIMER.call = setInterval(()=>{
        $("#helper2 .info span").text("00:"+((t<10)?"0"+t:t))

        if (t==1) {
            $("#helper2").addClass("chat")
            $("#helper2 .chat p").text(CONTACT[index].chat[0])
        }

        if (t==6) {
            $("#helper2 .chat p").text(CONTACT[index].chat[1])
        }

        if (t==11) {
            $("#helper2 .chat p").text(CONTACT[index].chat[2].replace("dapan",["A","B","C","D"][CONFIG.a]))
        }

        if (t==16) {
            $("#helper2 .chat p").text(CONTACT[index].chat[3])
        }

        if (t >= 22 ) {
            calling = false
            playSound(AUDIO.s_dis,0,null,false,0.6)
            $("#helper2").removeClass("chat")
            clearInterval(document.TIMER.call)
            $("#helper2 .info span").text("Kết thúc")
            setTimeout(()=>{                
                stopSound(AUDIO.m_calling)
                CONFIG.music.play()
                CONFIG.checkpoint[CONFIG.current] -=Date.now() / 1000
                CONFIG.pause = false
                $("#helper2").addClass("hidden")
            },3000)

        }
        t++
    },1000)
}

function countdown(second) {
    $("#countdown").css({"display":"flex"})
    $("#qa").addClass("hidden")
    let s = second
    $("#countdown p").text(s)
    document.TIMER.wait = setInterval(()=>{
        s--;
        if (s <=0 ) {
            clearInterval(document.TIMER.wait)
            $("#countdown").css({"display":"none"})
            $("#qa").removeClass("hidden")
        }else{
            $("#countdown p").text(s)
        }
        
    },1000)
}


function mergeQuestion(data,index) {
    let p = index % 4
    let a = [0,1,2,3].sort(() => Math.random() - 0.5);
    p = a.indexOf(p)
    let o = []
    a.forEach((e,i)=>{
        o.push(data.a[e])
    })
    return {"a":o,"p":p,"q":data.q}
}

function gameOver(CONFIG) {
    setTimeout(()=>{
        $("main").html( GAMEOVER.replace("phanthuong",["bàn tay trắng :))","5.000.000 đồng","20.000.000 đồng"][Math.floor(CONFIG.current / 5)]))
    },5000)
}

const GAMEOVER =  `
    <div id="gameover">
        <div class="img">
            <img src="" alt="" srcset="">
        </div>        
        <h1>THUA CUỘC</h1>
        <h3>Bạn đã ra về với phanthuong</h3>
    </div>
`

const API= `https://6489866a5fa58521caafc163.mockapi.io/ailaphu`

function exportData(CONFIG) {
    const id = localStorage.getItem('WEB_AiLaPhu_id')
    const name = localStorage.getItem('WEB_AiLaPhu_name')
    const t = {
        "name":name,
        "q":[CONFIG.checkpoint]
    }
    fetch(API + "/" + id,{
        method: 'POST',
        headers: {'content-type':'application/json'},
        body: JSON.stringify(t)})
    .then(

    )
    .catch(e=>{console.error(e)}    )
}

async function exportRank() {
    await fetch(API + "/" + id,{
        method: 'GET',
        headers: {'content-type':'application/json'}
    })
    .then(

    )
    .catch(e=>{console.error(e)}    )
}


