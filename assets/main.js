 /*
    1. Render song 
    2. Scroll top 
    3. Play / Pause / Seek
    4. CD Rotate
    5. Next / prev
    6. Random
    7. Next / Repeat when end
    8. Active song
    9. Scroll active song into view
    10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const cd = $('.cd');

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')

const playlist = $('.playlist')

const playBtn = $('.btn-toggle-play')

const player = $('.player')

const progress = $('#progress')

const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')

const randomBtn = $('.btn-random')

const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name:'Chạy Ngay Đi ',
            artirts: 'Sơn Tùng MTP',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.png'
        },
        {
            name:'Sài Gòn, buồn quá em ơi',
            artirts: 'Dế Choắt, Jason',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.png'
        },
        {
            name:'Voicemail',
            artirts: 'Hankim',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.png'
        },
        {
            name:'Hơi Ảo 8',
            artirts: 'Lucin8x',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.png'
        },
        {
            name:'Mascara',
            artirts: 'The Chillies',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.png'
        },
        {
            name:'25',
            artirts: 'Táo x Young H x Sol\'Bass x Nah x B Ray x Chú 13 x Khói',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.png'
        },
        {
            name:'Nắng Lên ',
            artirts: 'Rhymastic x SOOBIN x GONZO x B-wine x MastaL - Space Jam Volume 1 - Team Kim',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.png'
        },
        {
            name:'Nước mắt em lau bằng tình yêu mới',
            artirts: 'Dalab, Tóc tiên',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.png'
        },
        {
            name:'Virginity Syndrome',
            artirts: 'OVG',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.png'
        },
        {
            name:'Tháng Năm',
            artirts: 'Soobin Hoàng Sơn',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.png'
        },
        {
            name:'Tình Đầu ',
            artirts: 'Tăng Duy Tân',
            path: './assets/music/song11.mp3',
            image: './assets/img/song11.png'
        },
        {
            name:'Ngày Mai Em Đi',
            artirts: 'TOULIVER X LÊ HIẾU X SOOBIN HOÀNG SƠN',
            path: './assets/music/song12.mp3',
            image: './assets/img/song12.png'
        },
        {
            name:'Vài Lần Đón Đưa',
            artirts: 'SOOBIN HOÀNG SƠN',
            path: './assets/music/song13.mp3',
            image: './assets/img/song13.png'
        },
        {
            name:'Muốn Nói Với Em',
            artirts: 'TTeam - MUỐN NÓI VỚI EM - DT Tập Rap ft Mai Xuân Thứ',
            path: './assets/music/song14.mp3',
            image: './assets/img/song14.png'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
          return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                 </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.artirts}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                 </div>
                </div>
                        `
        });
        playlist.innerHTML = htmls.join("");
      },
    
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
      },
      
    handleEvents: function() {
        const cdWidth = cd.offsetWidth;
        const _this = this;

        // Handle CD rotation
        const cdThumbAnimate =  cdThumb.animate([
            {transform : 'rotate(360deg)'}
        ], {
            duration: 10000, //ten secs
            iterations: Infinity, // loop infinity times
        })
        cdThumbAnimate.pause();

        // handle zoom in/out CD events
            document.onscroll = function() {
            const scrollTop =  document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
            }
        // handle when click play button
            playBtn.onclick = function() {
                if(_this.isPlaying) {
                    audio.pause();
                }else {
                    audio.play();
                }
            }

            // When song is playing
            audio.onplay = function() {
                _this.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }

            // When song is paused
            audio.onpause = function() {
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            }

            // When song progress changes
            audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent
                }
            }

            // Handle when rewinding song
            progress.oninput = function(e) {
                const seekTime = audio.duration * e.target.value / 100
                audio.currentTime = seekTime;
            }

            //When next song is played
            nextBtn.onclick = function() {
                if(_this.isRandom) {
                    _this.playRandomSong();
                } else {
                    _this.nextSong();
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }

            //When prev song is played
            prevBtn.onclick = function() {
                if(_this.isRandom) {
                    _this.playRandomSong();
                } else {
                    _this.prevSong();
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();

            }

            // Handle on/off random btn song
            randomBtn.onclick = function() {
                _this.isRandom = !_this.isRandom;
                _this.setConfig('isRandom', _this.isRandom);
                randomBtn.classList.toggle('active', _this.isRandom);
            }

            // Handle repeat song
            repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat;
                _this.setConfig('isRepeat', _this.isRepeat);
                repeatBtn.classList.toggle('active', _this.isRepeat);
            }

            // Handle next song when audio is ended
            audio.onended = function() {
              if(_this.isRepeat) {
                audio.play();
              } else {
                nextBtn.click();
              }
            }

            // Listen to click behavior on playlist 
            playlist.onclick = function(e) {
                const songNode = e.target.closest('.song:not(.active)');
                const optionNode = e.target.closest('.option');
                
                if( songNode || optionNode) {
                    // Handle when click on song
                    if(songNode) {
                        // console.log(songNode.getAttribute('data-index')); dùng songNode.dataset.index nhanh hơn
                        _this.currentIndex = Number(songNode.dataset.index)// vì data sẽ trả về string nên phải dùng number
                        _this.loadCurentSong();
                        audio.play();
                        _this.render();
                    }   

                    // Handle when click on option
                    if(optionNode)
                    {

                    }
                }
            }

        
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'center',
                inline: 'center'
            });
        },300)
    },

    loadConfig: function() {
        // this.isRandom = this.config.isRandom
        // this.isRepeat = this.config.isRepeat
        Object.assign(this, this.config)
    },

    loadCurentSong: function() {


        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },


    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurentSong();
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurentSong();
    },

    playRandomSong: function() {
       let newIndex
       do {
            newIndex = Math.floor(Math.random() * this.songs.length)
       }while(newIndex === this.currentIndex)

       this.currentIndex = newIndex;
       this.loadCurentSong();
    },
    

    start: function () {
        // Gán cấu hình từ config vào ứng dụng 
        this.loadConfig();

        // Listen and handle( xử lý ) events (DOM events)
        this.handleEvents();
        
        // Define properties for Object
        this.defineProperties()

        // Upload information of first song into UI when start the program / web
        this.loadCurentSong()

        // Render playlist
        this.render()

        // Hiển thị trạng tháng ban đầu của btn repeat và random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
        
     }
  }
  app.start();