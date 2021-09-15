const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
	const lat = position.coords.latitude;
	const lon = position.coords.longitude;

	fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=bdd750ade079d93ea128e97ee405c250&units=metric`)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			render(data);
		})
		.catch((error) => console.log(error));
}

function error(err) {
	console.warn(`ERROR(${err.code}): ${err.message}`);
	renderDummyData();
}

function render(dataObj) {
	const currentObj = dataObj.current;
	const todayObj = dataObj.daily[0];
	const hourlyObjArr = dataObj.hourly;
	const dailyObjArr = dataObj.daily;

	renderDateAndTime();
	renderLocation(dataObj);
	renderCurrent(currentObj);
	renderToday(todayObj);
	renderHourly(hourlyObjArr);
	renderDaily(dailyObjArr);
}

function renderDateAndTime() {
	const now = new Date();
	const dayIndex = now.getDay();
	const date = now.getDate();
	const monthIndex = now.getMonth();
	const year = now.getFullYear();

	document.querySelector('.time').innerText = `${days[dayIndex]}, ${date} ${months[monthIndex]} ${year}`;
	document.querySelector('.note').innerText = `Data retrieved: ${now}.`;
}

function renderLocation(dataObj) {
	document.querySelector('.location').innerText = dataObj.timezone;
}

function renderCurrent(currentObj) {
	document.querySelector('.current .temp').innerText = toTempString(currentObj.temp);
	document.querySelector('.current .desc').innerText = currentObj.weather[0].description;

	const iconElement = document.querySelector('.current .icon');
	const iconCode = currentObj.weather[0].icon;
	addIcon(iconElement, iconCode);
}

function renderToday(todayObj) {
	document.querySelector('.all-day .temp-high').innerText = toTempString(todayObj.temp.max);
	document.querySelector('.all-day .temp-low').innerText = toTempString(todayObj.temp.min);
	document.querySelector('.all-day .wind').innerText = `${todayObj.wind_speed}m/s`;
	document.querySelector('.all-day .rain').innerText = `${(todayObj.pop * 100).toFixed(0)}%`;
	document.querySelector('.all-day .humidity').innerText = `${todayObj.humidity}%`;
	document.querySelector('.all-day .uvi').innerText = todayObj.uvi;
	document.querySelector('.all-day .sunrise').innerText = getHourAndMin(todayObj.sunrise);
	document.querySelector('.all-day .sunset').innerText = getHourAndMin(todayObj.sunset);
}

function renderHourly(hourlyObjArr) {
	for (let i = 1; i < hourlyObjArr.length; i++) {
		document.querySelector('.hourly').appendChild(getCloneHourlyTemplate(hourlyObjArr[i]));
	}
}

function renderDaily(dailyObjArr) {
	for (let i = 1; i < dailyObjArr.length; i++) {
		document.querySelector('.daily').appendChild(getCloneDailyTemplate(dailyObjArr[i]));
	}
}

function getCloneHourlyTemplate(hourlyObj) {
	const hourlyTemplate = document.querySelector('template#hourly');
	const clone = hourlyTemplate.content.cloneNode(true);

	clone.querySelector('.hour').innerText = getHourlyHour(hourlyObj.dt);
	clone.querySelector('.temp').innerText = toTempString(hourlyObj.temp);

	const iconElement = clone.querySelector('.icon');
	const iconCode = hourlyObj.weather[0].icon;
	addIcon(iconElement, iconCode);

	return clone;
}

function getCloneDailyTemplate(dailyObj) {
	const dailyTemplate = document.querySelector('template#daily');
	const clone = dailyTemplate.content.cloneNode(true);

	clone.querySelector('.day').innerText = getShortDay(dailyObj.dt);
	clone.querySelector('.date').innerText = getDateAndMonth(dailyObj.dt);
	clone.querySelector('.temp-low').innerText = toTempString(dailyObj.temp.min);
	clone.querySelector('.temp-high').innerText = toTempString(dailyObj.temp.max);
	clone.querySelector('.wind').innerText = `${dailyObj.wind_speed}m/s`;
	clone.querySelector('.rain').innerText = `${(dailyObj.pop * 100).toFixed(0)}%`;
	clone.querySelector('.humidity').innerText = `${dailyObj.humidity}%`;
	clone.querySelector('.uvi').innerText = dailyObj.uvi;

	const iconElement = clone.querySelector('.icon');
	const iconCode = dailyObj.weather[0].icon;
	addIcon(iconElement, iconCode);

	return clone;
}

function toTempString(tempNumb) {
	return `${Math.floor(tempNumb)}°`;
}

function getHourAndMin(unixEpochTime) {
	const date = new Date(unixEpochTime * 1000);
	return date.toLocaleTimeString().slice(0, 5);
}

function getHourlyHour(unixEpochTime) {
	const date = new Date(unixEpochTime * 1000);
	const hour = date.getHours();

	if (hour === 0) return `12am`;
	if (hour === 12) return `12pm`;
	if (hour > 12) return `${hour - 12}pm`;
	return `${hour}am`;
}

function getShortDay(unixEpochTime) {
	const date = new Date(unixEpochTime * 1000);
	return days[date.getDay()].slice(0, 3);
}

function getDateAndMonth(unixEpochTime) {
	const date = new Date(unixEpochTime * 1000);
	return `${date.getDate()}/${date.getMonth() + 1}`;
}

function addIcon(element, iconCode) {
	element.style.backgroundImage = `url(http://openweathermap.org/img/wn/${iconCode}@2x.png)`;
}

function renderDummyData() {
	for (let i = 0; i < 48; i++) {
		document.querySelector('.hourly').appendChild(document.querySelector('template#hourly').content.cloneNode(true));
	}

	for (let i = 0; i < 7; i++) {
		document.querySelector('.daily').appendChild(document.querySelector('template#daily').content.cloneNode(true));
	}

	const icons = document.querySelectorAll('.icon');
	icons.forEach((icon) => addIcon(icon, '10d'));
}
