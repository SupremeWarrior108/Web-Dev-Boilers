function closePopup() {
    document.getElementById('notificationPopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function allowNotifications() {
    alert('Notifications allowed!');
    closePopup();
}