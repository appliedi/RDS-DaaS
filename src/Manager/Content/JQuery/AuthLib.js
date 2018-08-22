function SetAuthCookie(userName, userRole) {
    var date = new Date();
    date.setTime(date.getTime() + (60 * 60 * 1000));
    var expires = "expires=" + date.toUTCString();
    document.cookie = "RDSManager=" + JSON.stringify({ user: userName, role: userRole }) + ";" + expires + ";path=/";
}

function RemoveAuthCookie(userName, userRole) {
    document.cookie = "RDSManager=" + JSON.stringify({ user: '', role: '' }) + "; expires=Thu, 01 Jan 2001 00:00:00 UTC;path=/";
}

function GetAuthCookie() {
    var name = "RDSManager=";
    var allCookies = document.cookie.split(';');
    for (var i = 0; i < allCookies.length; i++) {
        var cookie = allCookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
}

function ValidateAuth(userRole) {

    var validUser = false;
    var cookieValue = GetAuthCookie();
    var cookieJson = JSON.parse(cookieValue);
    if (cookieValue != null) {
        var userRoles = userRole.split(';');
        for (var i = 0; i < userRoles.length; i++) {
            if (userRoles[i] == cookieJson["role"]) {
                validUser = true;
            }
        }
    }

    return validUser;
}


