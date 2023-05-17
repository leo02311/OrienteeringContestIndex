var index = 0;
var page = 0;
var f = [3, 2, 3, 3, 4, 2, 2, 3, 2, 4, 4, 3, 2, 3, 3, 6]

function va() {
    let ini = new Boolean(false);
    let table = [
        [25.04379633995752, 121.52897654108095],
        [25.044181375880893, 121.52922098799056],
        [25.044526053863915, 121.52966259955943],
        [25.04486306546481, 121.52909606695177],
        [25.044699608636492, 121.52885839808732],
        [25.04514798481371, 121.52942933142187],
        [25.045275712302637, 121.53024606406687],
        [25.045029217873473, 121.52881711721417],
        [25.045228478966123, 121.52806609869002],
        [25.04495874740952, 121.52759604156017],
        [25.045549, 121.529008],
        [25.045852382793093, 121.52883220463993],
        [25.0457296677829, 121.53011731803414],
        [25.044723035563482, 121.52833230793479],
        [25.04437554201557, 121.5287369862199],
        [25.044523166143108, 121.52889691293241]
    ]
    this.getTable = function() {
        return table;
    }
    this.getIni = function() {
        return ini;
    }

}

const app = new va();

function closing() {
    var runTime = setInterval(function() {
        if (green.length == 16) {
            clearInterval(runTime)
        };
        set()
    }, 1000);
    setTimeout(go(), 1000);
    var run = setInterval(function() {
        if (green.length == 16) {
            clearInterval(run);
        }
        go();
    }, 2000);
}

function go() {
    var tr = [];
    var table = app.getTable();
    if (ini == false) {
        if (search(0) <= 20) {
            ini = true;
            green.push(0)
            $('#g1 > button.btn').eq(0).removeClass('btn-danger').addClass('btn-success');
            $('#g1 > button.btn').eq(1).removeClass('disabled')
            t = Date.now();
            totalt = Date.now();
        }
    } else {
        if (red != null) {
            if (search(red[0] + 1) <= 20) {
                green.push(red.shift() + 1)
                tr.push((Date.now() - t) / 1000);
                t = Date.now();
                if (parseInt(green[green.length - 1]) <= 7) {
                    $('#g1 > button.btn').eq(green[green.length - 1]).removeClass('btn-danger').addClass('btn-success');
                    if (green[green.length - 1] == 7) {
                        $('#g2 > button.btn').eq(0).removeClass('disabled');
                    } else {
                        $('#g1 > button.btn').eq(green[green.length - 1] + 1).removeClass('disabled');
                    }
                } else {
                    $('#g2 > button.btn').eq(green[green.length - 1] - 8).removeClass('btn-danger').addClass('btn-success');
                    if (green.length != 16) {
                        $('#g2 > button.btn').eq(green[green.length - 1] - 7).removeClass('disabled')
                    }
                }
                data = JSON.stringify({
                    studentNumber: document.getElementById("sc").value,
                    point: green,
                    record: tr,
                })
                $.ajax({
                    url: "/send",
                    type: "POST",
                    contentType: 'application/json',
                    accept: 'application/json',
                    dataType: 'json',
                    data: data,
                    success: (data) => {

                    },
                    error: function(err) {
                        alert('無法送出資料')
                    },
                })
            }
        }
    }

}

function getLocation(i) {
    document.getElementById("dist").innerHTML = "計算中"
    document.getElementById("dist").innerHTML = search(i) + "公尺";
}

$('#g1 > button.btn').on('click', function() {
    var thisBtn = $(this);
    thisBtn.addClass('active').siblings().removeClass('active');
    $('#g2 > button.btn').removeClass('active');
    index = thisBtn.val();
    page = 0;
    $("#pic").attr("src", "static/img/" + index + "/" + page + ".jpg");
    getLocation(index);
    if (index == 0) {
        document.getElementById("p").innerHTML = '起點';
    } else if (index == 15) {
        document.getElementById("p").innerHTML = '終點';
    } else {
        document.getElementById("p").innerHTML = index;
    }
});
$('#g2 > button.btn').on('click', function() {
    var thisBtn = $(this);
    thisBtn.addClass('active').siblings().removeClass('active');
    $('#g1 > button.btn').removeClass('active');
    index = thisBtn.val();
    page = 0;
    $("#pic").attr("src", "static/img/" + index + "/" + page + ".jpg");
    getLocation(index);
    if (index == 0) {
        document.getElementById("p").innerHTML = '起點';
    } else if (index == 15) {
        document.getElementById("p").innerHTML = '終點';
    } else {
        document.getElementById("p").innerHTML = index;
    }
});
$('#prev').on('click', function() {
    if (page == 0) {
        page = f[index] - 1;
    } else {
        page--;
    }
    $("#pic").attr("src", "static/img/" + index + "/" + page + ".jpg");
})
$('#next').on('click', function() {
    if (page == f[index] - 1) {
        page = 0;
    } else {
        page++;
    }
    $("#pic").attr("src", "static/img/" + index + "/" + page + ".jpg");
})
$('#cal').click(function() {
    if (document.getElementById("sc").value.match(/([A-Z|a-z]{1}[0-9]{8})/g) != null) {
        if (document.getElementById("sc").value.length == 9) {
            if (timer == false) {
                if (green.length <= 15) {
                    document.getElementById("state").innerHTML = "進行中"
                    document.getElementById("sc").readOnly = true;
                    timer = true;
                    totalt = Date.now();
                    t = Date.now();
                    closing();
                }
            }
        } else {
            alert('長度不符')
        }
    } else {
        alert('格式不符')
    }
});

var watchID;
var geoLoc;
var lat;
var long;

function showLocation(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
}

function errorHandler(err) {
    if (err.code == 1) {
        alert("存取定位遭拒");
    } else if (err.code == 2) {
        alert("無法獲得座標");
    }
}

function getLocationUpdate() {
    if (navigator.geolocation) {
        // timeout at 60000 milliseconds (60 seconds)
        var options = {
            timeout: 60000
        };
        geoLoc = navigator.geolocation;
        watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
    } else {
        alert("Sorry, browser does not support geolocation!");
    }
}

function search(i) {
    table = app.getTable();
    var R = 6371.0710; // Radius of the Earth in miles
    var rlat1 = lat * (Math.PI / 180); // Convert degrees to radians
    var rlat2 = table[i][0] * (Math.PI / 180); // Convert degrees to radians
    var difflat = rlat2 - rlat1; // Radian difference (latitudes)
    var difflon = (table[i][1] - long) * (Math.PI / 180); // Radian difference (longitudes)
    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    return Math.ceil(d * 1000);

}
var t = 0;
var totalt = 0;
var timer = new Boolean(false);

function set() {
    document.getElementById("now").innerHTML = convertT((Date.now() - t) / 1000);
    document.getElementById("all").innerHTML = convertT((Date.now() - totalt) / 1000);
}

function convertT(t) {
    let hours = Math.floor(t / 3600);
    if (Math.floor((t % 3600) / 60) < 10) {
        var mins = '0' + Math.floor((t % 3600) / 60);
    } else {
        mins = Math.floor((t % 3600) / 60);
    }
    if (((t % 3600) % 60) < 10) {
        var seconds = '0' + parseInt((t % 3600) % 60);
    } else {
        seconds = parseInt((t % 3600) % 60);
    }
    return hours + ':' + mins + ':' + seconds
}

$(document).ready(function() {
    getLocationUpdate();
    getLocation(index);
    var getD = setInterval(function() {
        getLocation(index);
    }, 2000);
    $('#g1 > button.btn').addClass('disabled');
    $('#g2 > button.btn').addClass('disabled');
    $('#g1 > button.btn').eq(0).removeClass('disabled');
    if (green != null) {
        for (i = 0; i < green.length; i++) {
            if (green[i] < 8) {
                $('#g1 > button.btn').eq(i).removeClass('btn-danger').addClass('btn-success');
                if (i == 7) {
                    $('#g2 > button.btn').eq(i + 1 - 8).removeClass('disabled');
                } else {
                    $('#g1 > button.btn').eq(i + 1).removeClass('disabled');
                }
            } else {
                $('#g2 > button.btn').eq(green[i] - 8).removeClass('btn-danger').addClass('btn-success');
                if (i != 15) {
                    $('#g2 > button.btn').eq(green[i] - 7).removeClass('disabled')
                }
            }
        }
    }
    $("img").on('click', function() {
        var image = new Image();
        image.src = "static/img/" + index + "/" + page + ".jpg";
        var viewer = new Viewer(image, {
            hidden: function() {
                viewer.destroy();
            },
            toolbar: 0,
            title: false,
            navbar: false,
            tooltip: false,
        });
        // image.click();
        viewer.show();
    });
    document.getElementById('button').addEventListener('click', function() {
        var image = new Image();
        image.src = 'static/img/map.png';
        var viewer = new Viewer(image, {
            hidden: function() {
                viewer.destroy();
            },
            toolbar: 0,
            title: false,
            navbar: false,
            tooltip: false,
        });
        // image.click();
        viewer.show();
    });
});