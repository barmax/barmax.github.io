firebase.initializeApp({
    messagingSenderId: '1039713673234'
});

// браузер поддерживает уведомления
// вообще, эту проверку должна делать библиотека Firebase, но она этого не делает
if ('Notification' in window) {
    var messaging = firebase.messaging();

    // пользователь уже разрешил получение уведомлений
    // подписываем на уведомления если ещё не подписали
    if (Notification.permission === 'granted') {
        subscribe();
    }

    // по клику, запрашиваем у пользователя разрешение на уведомления
    // и подписываем его
    $('#subscribe').on('click', function() {
        subscribe();
    });
}

function subscribe() {
    // запрашиваем разрешение на получение уведомлений
    messaging.requestPermission()
        .then(function() {
            // получаем ID устройства
            messaging.getToken()
                .then(function(currentToken) {
                    console.log(currentToken);

                    if (currentToken) {
                        sendTokenToServer(currentToken);
                    } else {
                        console.warn('Не удалось получить токен.');
                        setTokenSentToServer(false);
                    }
                })
                .catch(function(err) {
                    console.warn('При получении токена произошла ошибка.', err);
                    setTokenSentToServer(false);
                });
        })
        .catch(function(err) {
            console.warn('Не удалось получить разрешение на показ уведомлений.', err);
        });
}

// отправка ID на сервер
function sendTokenToServer(currentToken) {
    if (isTokenSentToServer(currentToken)) {
        console.log('Отправка токена на сервер...');

        var url = 'push.php'; // адрес скрипта на сервере который сохраняет ID устройства
        $.post(url, {
                token: currentToken
            },
            // onAjaxSuccess
        );

        // function onAjaxSuccess(data) {
        //     // Здесь мы получаем данные, отправленные сервером и выводим их на экран.
        //     console.log(data);
        // }

        setTokenSentToServer(currentToken);
    } else {
        console.log('Токен уже отправлен на сервер.');
    }
}

// используем localStorage для отметки того,
// что пользователь уже подписался на уведомления
function isTokenSentToServer(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

function setTokenSentToServer(currentToken) {
    window.localStorage.setItem(
        'sentFirebaseMessagingToken',
        currentToken ? currentToken : ''
    );
}

if ('Notification' in window) {
    var messaging = firebase.messaging();

    messaging.onMessage(function(payload) {
        console.log('Message received. ', payload);

        // регистрируем пустой ServiceWorker каждый раз
        navigator.serviceWorker.register('firebase-messaging-sw.js');

        // запрашиваем права на показ уведомлений если еще не получили их
        Notification.requestPermission(function(result) {
            if (result === 'granted') {
                navigator.serviceWorker.ready.then(function(registration) {
                    // теперь мы можем показать уведомление
                    return registration.showNotification(payload.notification.title, payload.notification);
                }).catch(function(error) {
                    console.log('ServiceWorker registration failed', error);
                });
            }
        });
    });

    // ...
}