
//IIFEE 
(function () {

    var alarmData = [];  //contains alarm data
    var ringtone = new Audio("./tones/1.mp3");

    var playCount = 0;        //keeps count of currently ringing alarm;


    // ________________clock time_________________________

    function prefixZero(num) {

        if (num < 10) {
            return ("0" + num);
        }

        return num;
    }

    function getDayName(i) {
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        return days[i];
    }

    function getMonthName(i) {
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[i];
    }

    function updateTime() {

        let d = document.getElementById('date');
        let time = document.getElementById('time');

        let hour, min, sec;
        let am_pm;
        let day, month, year, date;
        let currentDate = new Date();


        //setting hour
        hour = currentDate.getHours();
        if (hour >= 12) {

            if(hour>12){
                hour = hour - 12;
            }
           
            am_pm = "PM";
        } else{
            am_pm = "AM";
        }
        hour = prefixZero(hour);

        //setting minute
        min = currentDate.getMinutes();
        min = prefixZero(min);

        //setting seconds
        sec = currentDate.getSeconds();
        sec = prefixZero(sec);

        //setting day
        day = currentDate.getDay();
        day = getDayName(day);

        //setting month
        month = currentDate.getMonth();
        month = getMonthName(month);

        //setting year
        year = currentDate.getFullYear();

        //setting date
        date = currentDate.getDate();
        date = prefixZero(date);

        //updating time
        time.innerHTML = `${hour}:${min}:${sec} ${am_pm}`;
        d.innerHTML = `${day} , ${month} ${date} , ${year}`;


        alarmData.forEach(async function (data) {

            if (data.hour == hour && data.minute == min && data.second == sec && data.am_pm.toUpperCase() == am_pm && data.status == 'pending') {

                console.log(`alarm ${data.name} .. ringing...`);

                ringtone.currentTime = 0;
                await ringtone.play();
                ringtone.loop = true;
                data.status = 'ringing';

                renderAlarmData();
                setTimeout(function () { alert(`Alarm ${data.name} is ringing....... `) }, 1000);
                playCount++;

            }
        });
    }



    //___________________Set Alarm _______________________________

    function alarmChoices() {

        let hour = document.getElementById('hour');
        let minute = document.getElementById('minute');
        let am_pm = document.getElementById('am/pm');

        //adding hours ...choices
        for (let i = 1; i <= 12; i++) {

            let h = prefixZero(i);
            hour.insertAdjacentHTML('beforeend', `<option value='${h}'>${h}</option>`);

        }


        //adding minutes ...choices
        for (let i = 1; i <= 59; i++) {
            let m = prefixZero(i);
            minute.insertAdjacentHTML('beforeend', `<option value='${m}'>${m}</option>`)
        }


        //adding seconds ....choices

        for (let i = 1; i <= 59; i++) {
            let s = prefixZero(i);
            second.insertAdjacentHTML('beforeend', `<option value='${s}'>${s}</option>`)
        }

        //adding am/pm choice
        am_pm.insertAdjacentHTML('beforeend', `<option value='am'>am</option>`);
        am_pm.insertAdjacentHTML('beforeend', `<option value='pm'>pm</option>`);
    }


    function setAlarm() {

        let hour = document.getElementById('hour');
        let minute = document.getElementById('minute');
        let second = document.getElementById('second');
        let am_pm = document.getElementById('am/pm');
        let name = document.getElementById('alarm-name');

        console.log(hour.value);
        console.log(minute.value);
        console.log(am_pm.value);

        if (hour.value == '00'  || am_pm.value == 'am/pm') {

            alert('Enter valid time !!!');
            return;
        }


        let newAlarm = {
            hour: hour.value,
            minute: minute.value,
            second: second.value,
            am_pm: am_pm.value,
            name: name.value,
            status: "pending",
            id: `c${Date.now()}`

        }

        alarmData.push(newAlarm);

        alert('alarm successfully added !!!')
        renderAlarmData();  //rendering updated alarm data
    }



    // _____________rendering alarm data____________________


    function renderAlarmData() {

        let alarmClockDataContainer = document.querySelector('#alarmclock-data-container');

        if (alarmData.length == 0) {

            alarmClockDataContainer.style.display = 'none';

        } else {

            alarmClockDataContainer.style.display = 'flex';

            let alarmClockData = document.querySelector('#alarmclock-data-container table');
            alarmClockData.innerHTML = '';
            alarmClockData.insertAdjacentHTML('beforeend', `
            <tr> 
                <th>Name</th>
                <th>Alarm</th>
                <th>Status</th>
                <th>Delete</th>
        
            </tr>`
            )

            alarmData.forEach((data) => {

                alarmClockData.insertAdjacentHTML('beforeend',
                    `<tr id='${data.id}'>
                    <td class="alarm-name">${data.name}</td>
                    <td class="alarm-time">${data.hour}:${data.minute}:${data.second} ${data.am_pm}</td>
                    <td class="status">
                    
                        <a class="stop-alarm" > 
                            <i data-id = "${data.id}" class="fa-regular fa-circle-stop stop"></i>
                         
                        </a>
                        <i class="fa-solid fa-toggle-on pending"> </i>
                        <i class="fa-solid fa-bell fa-shake ringing"></i></i>
                       
                        <i class="fa-solid fa-check stopped"></i>

                     </td>

                    <td> <i data-id = "${data.id}" class="fa-solid fa-trash delete-alarm"></i></td>
                </tr>`

                );

                let stopAlarmButton = document.querySelector(`#${data.id} .status .stop-alarm i`);
                let ringingIcon = document.querySelector(`#${data.id} .status .ringing`);
                let pendingIcon = document.querySelector(`#${data.id} .status .pending`);
                let stoppedIcon = document.querySelector(`#${data.id} .status .stopped`);

                if (data.status == 'ringing') {

                    ringingIcon.style.display = 'inline-block';
                    pendingIcon.style.display = 'none';
                    stoppedIcon.style.display = 'none';

                    stopAlarmButton.style.display = 'inline-block';

                } else if (data.status == 'stopped') {

                    ringingIcon.style.display = 'none';
                    pendingIcon.style.display = 'none';
                    stoppedIcon.style.display = 'inline-block';

                    stopAlarmButton.style.display = 'none';
                } else if (data.status == 'pending') {

                    ringingIcon.style.display = 'none';
                    pendingIcon.style.display = 'inline-block';
                    stoppedIcon.style.display = 'none';


                    stopAlarmButton.style.display = 'none';
                }

            });
        }

    }


    //_________________________stop alarm__________________________________

    function stopAlarm(id) {

        let alarm;


        alarmData.forEach((data) => {

            if (data.id == id) {
                alarm = data;
            }
        });


        alarm.status = "stopped";

        alert(`alarm ${alarm.name} (${alarm.hour}:${alarm.minute}:${alarm.second}) is stopped`)

        playCount--;

        if (playCount == 0) {
            ringtone.pause();
        }


        renderAlarmData();

    }


    // _______________________delete alarm__________________________

    function deleteAlarm(id){

        console.log('delete'+id);

        let deleted ;


        alarmData = alarmData.filter((data)=>{

             if(data.id==id  ){

                deleted = data;
                if(data.status=='ringing')
                   stopAlarm(id); 
                  
             }

             return (data.id!=id);
        })

     


        alert(`alarm ${deleted.name} (${deleted.hour}:${deleted.minute}:${deleted.second}) is deleted successfully`);
        renderAlarmData();
    }


    window.onload = () => {

        //menu button 
        let menuButton = document.querySelector('#options-menu i');
        let menuDisplay = false;            // if true nav items will be displayed

        menuButton.onclick = () => {

            let navContainer = document.querySelector('#nav-container');

            menuDisplay = !menuDisplay;

            if (menuDisplay) {

                navContainer.style.display = 'flex';
            } else {
                navContainer.style.display = 'none';
            }

        }


        setInterval(updateTime, 1000);   //firing updateTime after every 1 sec

        alarmChoices();  //setting alarm (hours , minutes ,seconds ) choices using function alarmChoices();



        let setAlarmButton = document.getElementById('setalarm-button');
        setAlarmButton.onclick = () => {
            setAlarm();
        }


        let alarmClockData = document.querySelector('#alarmclock-data-container table');

        alarmClockData.addEventListener('click', function (e) {                          //handling delete alarm and stop alarm


            if (e.target.parentElement.className == 'stop-alarm') {
                stopAlarm(e.target.getAttribute('data-id'))
            }


            if(e.target.className == 'fa-solid fa-trash delete-alarm'){
                deleteAlarm(e.target.getAttribute('data-id'));
            }
        });
    };
})();
