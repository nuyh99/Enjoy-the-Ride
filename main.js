const bicycle_stoarge =
  "http://api.data.go.kr/openapi/tn_pubr_public_bcycl_dpstry_api?serviceKey=YFL%2FH6LkrOXDv5gDIuV%2B1jEes0x%2Fd1TijfatGwAJDYrV19cZ0nmqRPZzxRhR6gqso88WhTR1TyltgzUkE3KBeA%3D%3D&pageNo=0&numOfRows=100&type=json";

var mapContainer = document.getElementById("map"); // 지도를 표시할 div
var mapOption = {
  center: new kakao.maps.LatLng(35.1342, 129.1031), // 지도의 중심좌표
  level: 7, // 지도의 확대 레벨
};

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다.
var marker;

// ------------------------- 자전거 도로 표시 -------------------------

var status_bicycle = 1;
var mapTypes = {
  bicycle: kakao.maps.MapTypeId.BICYCLE,
};

map.addOverlayMapTypeId(mapTypes.bicycle);

function setOverlayMapTypeId() {
  if (status_bicycle == 1) {
    status_bicycle = 0;
    map.removeOverlayMapTypeId(mapTypes.bicycle);
  } else {
    status_bicycle = 1;
    map.addOverlayMapTypeId(mapTypes.bicycle);
  }
}

// ---------------------------- 현재 위치 마커 표시 ---------------------------

if (navigator.geolocation) {
  // GeoLocation을 이용해서 접속 위치를 얻어옵니다
  navigator.geolocation.getCurrentPosition(function (position) {
    var lat = position.coords.latitude; // 위도
    var lon = position.coords.longitude; // 경도

    var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
      message =
        '<div style="padding:10px;">&nbsp;&nbsp;' +
        "<span style='display: inline-block; width: 14px; height: 14px; background-image: url(./geolocation.png);'></span>" +
        "&nbsp;&nbsp;<strong>현재 위치</strong></div>"; // 인포윈도우에 표시될 내용입니다

    // 마커와 인포윈도우를 표시합니다
    displayMarker(locPosition, message);
  });
} else {
  // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

  var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
    message = "현재위치 제공이 불가능합니다.";

  displayMarker(locPosition, message);
}

var status_start = 1;

// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayMarker(locPosition, message) {
  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    map: map,
    position: locPosition,
  });

  var iwContent = message, // 인포윈도우에 표시할 내용
    iwRemoveable = true;

  // 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.InfoWindow({
    content: iwContent,
    removable: iwRemoveable,
  });

  // 인포윈도우를 마커위에 표시합니다
  infowindow.open(map, marker);

  kakao.maps.event.addListener(marker, "click", function () {
    if (status_start == 1) {
      status_start = 0;
      infowindow.close();
      map.panTo(locPosition);
    } else {
      status_start = 1;
      infowindow.open(map, marker);
    }
  });

  // 지도 중심좌표를 현재위치로 변경합니다
  map.setCenter(locPosition);
  map.setLevel(3, { animate: { duration: 1000 } }); // 지도 확대레벨을 7->3으로 변경하는 애니메이션
}

// -----------------------------  마우스 눌러서 누른위치 마커 --------------------------

var click_marker = new kakao.maps.Marker({ position: null });
click_marker.setMap(map);
var status_infowindow = 0;
var click_infowindow = new kakao.maps.InfoWindow({
  position: 0,
  content: "",
});
kakao.maps.event.addListener(map, "click", function (mouseEvent) {
  click_infowindow.close();
  // 클릭한 위도, 경도 정보를 가져옵니다
  var latlng = mouseEvent.latLng;
  map.panTo(latlng);

  // 마커 위치를 클릭한 위치로 옮깁니다
  click_marker.setPosition(latlng);

  status_infowindow = 0;
});

kakao.maps.event.addListener(click_marker, "click", function () {
  var latlng = click_marker.getPosition();
  var iwContent =
    '<div style="padding:10px;">&nbsp;&nbsp;' +
    '<a href="https://map.kakao.com/link/to/도착지,' +
    latlng.Ma +
    ", " +
    latlng.La +
    '" style="color:blue" target="_blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>길찾기</strong></a>' +
    "</div>";
  // 인포윈도우를 생성합니다

  click_infowindow.setContent(iwContent);
  // 마커 위에 인포윈도우를 표시합니다
  if (status_infowindow == 1) {
    status_infowindow = 0;
    click_infowindow.close();
  } else {
    status_infowindow = 1;
    click_infowindow.open(map, click_marker);
  }
});

// ------------------------공공데이터 각종 변수---------------------------------
var busanGugun = [
  "3250000",
  "3260000",
  "3270000",
  "3280000",
  "3290000",
  "3300000",
  "3310000",
  "3320000",
  "3330000",
  "3340000",
  "3350000",
  "3360000",
  "3370000",
  "3380000",
  "3390000",
  "3400000",
];

// 공공 데이터 url의 주소를 배열로 하였습니다.
var dpstryurl = [];

// 공공 데이터를 for문으로 받습니다.
for (var i = 0; i < busanGugun.length; i++) {
  dpstryurl[i] =
    "https://enjoytheride.herokuapp.com/http://api.data.go.kr/openapi/tn_pubr_public_bcycl_dpstry_api?serviceKey=YFL%2FH6LkrOXDv5gDIuV%2B1jEes0x%2Fd1TijfatGwAJDYrV19cZ0nmqRPZzxRhR6gqso88WhTR1TyltgzUkE3KBeA%3D%3D&pageNo=1&numOfRows=100&type=json&instt_code=" +
    busanGugun[i];
}
// 부산광역시의 구 이름을 배열로 저장하였습니다.
var busanGugunName = [
  "중구",
  "서구",
  "동구",
  "영도구",
  "부산진구",
  "동래구",
  "남구",
  "북구",
  "해운대구",
  "사하구",
  "금정구",
  "강서구",
  "연제구",
  "수영구",
  "사상구",
  "기장군",
];

// ------------------- 키워드로 자전거 수리점 검색 -------------------------

//현재 위치에 쓰일 좌표 변수를 선언하였습니다.
var x, y;

// 마커의 갯수
var markers = [];

var markerImageUrl1 = "parking.png",
  markerImageUrl2 = "spanner.png",
  markerImageSize1 = new kakao.maps.Size(30, 30), // 마커 이미지의 크기
  markerImageSize2 = new kakao.maps.Size(45, 45),
  markerImageOptions = {
    offset: new kakao.maps.Point(20, 42), // 마커 좌표에 일치시킬 이미지 안의 좌표
  };
var markerImage1 = new kakao.maps.MarkerImage(
  markerImageUrl1,
  markerImageSize1,
  markerImageOptions
);
var markerImage2 = new kakao.maps.MarkerImage(
  markerImageUrl2,
  markerImageSize2,
  markerImageOptions
);

//마커, 클러스터를 지우는 함수입니다.
function delMarkers() {
  clusterer.clear();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
    markers.pop();
  }
  markers = [];
}

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

// 마커 클러스터를 쓰기 위한 객체를 생성합니다.
var clusterer = new kakao.maps.MarkerClusterer({
  map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
  averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
  minLevel: 14, // 클러스터 할 최소 지도 레벨
});

var status_bicycle_repair = 0;

function clickButton() {
  if (status_bicycle_repair == 1) {
    status_bicycle_repair = 0;
    delMarkers();
    infowindow.close();
  } else {
    status_bicycle_repair = 1;
    for (var i = 0; i < busanGugunName.length; i++) {
      ps.keywordSearch(
        "부산광역시" + busanGugunName[i] + "자전거 수리점",
        placesSearchCB
      );
    }
  }
}

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    var bounds = new kakao.maps.LatLngBounds();

    for (var i = 0; i < data.length; i++) {
      displayMarker_2(data[i]);
      bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
    }
  }
}

// 지도에 마커를 표시하는 함수입니다
function displayMarker_2(place) {
  // 마커를 생성하고 지도에 표시합니다
  var marker = new kakao.maps.Marker({
    map: map,
    image: markerImage2,
    position: new kakao.maps.LatLng(place.y, place.x),
    clickable: true,
  });

  //인포 윈도우를 생성합니다.
  var infowindow = new kakao.maps.InfoWindow({
    content:
      '<div style="padding:20px;font-size:20;">' +
      place.place_name +
      "<br>" +
      '<a href="https://map.kakao.com/link/to/' +
      place.place_name +
      ", " +
      place.y +
      ", " +
      place.x +
      '" style="color:blue" target="_blank">길찾기</a><div>',
    removable: true,
  });

  // 마커에 클릭이벤트를 등록합니다
  kakao.maps.event.addListener(marker, "click", function () {
    // 마커 위에 인포윈도우를 표시합니다
    infowindow.open(map, marker);
    map.panTo(new kakao.maps.LatLng(place.y, place.x));
  });

  //마커를 배열 markers에 넣습니다.
  markers.push(marker);
  // 마커들이 있는 markers를 클러스터 표시합니다.
  clusterer.addMarkers(markers);
}

// ----------------------- 공공데이터 자전거 보관함 ------------------------------

var markers2 = [];

var clusterer_2 = new kakao.maps.MarkerClusterer({
  map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
  averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
  minLevel: 4, // 클러스터 할 최소 지도 레벨
});

function delMarkers_2() {
  clusterer_2.clear();
  for (var i = 0; i < markers2.length; i++) {
    markers2[i].setMap(null);
    markers2.pop();
  }
  markers2 = [];
}

var button_status = 0;

function dpstry() {
  // 나와있던 마커, 클러스터를 전부 지웁니다.
  if (button_status == 0) {
    delMarkers_2();
    for (var i = 0; i < busanGugun.length; i++) {
      // 자전거 보관함 공공데이터 api를 fetch하여 json형식으로 받습니다.
      fetch(dpstryurl[i])
        .then((res) => res.json())
        .then((resJson) => {
          for (var j = 0; j < 98; j++) {
            //공공 데이터 안에 있는 위도, 경도, 주소를 저장합니다.
            var lat = resJson.response.body.items[j].latitude;
            var lng = resJson.response.body.items[j].longitude;
            var rdn = resJson.response.body.items[j].rdnmadr;

            // 위도, 경도에 대한 마커를 표시합니다.
            var marker = new kakao.maps.Marker({
              image: markerImage1,
              position: new kakao.maps.LatLng(lat, lng),
              map: map,
            });

            // 마커에 대한 인포윈도우를 설정하고 인포윈도우안에 자전거 보관함에 대한 주소를 넣었습니다.
            var infoWindow = new kakao.maps.InfoWindow({
              content:
                '<div style="padding:33px 60px;">' +
                '<span style="font-size:22px"><strong>자전거 보관함</strong></span>' +
                '<a href="https://map.kakao.com/link/to/' +
                rdn +
                ", " +
                lat +
                ", " +
                lng +
                ' "style="padding-left: 10px; color:blue; font-size:16px" target="_blank"><strong>길찾기</strong></a><br>' +
                '<span style = "padding-left:5px; font-size:14px;">' +
                rdn +
                "</span>" +
                "</div>",
            });

            // marker를 배열인 markers에 넣고 markers를 cluster안에 넣습니다.
            markers2.push(marker);
            kakao.maps.event.addListener(
              marker,
              "mouseover",
              mouseOverListener(map, marker, infoWindow)
            );
            kakao.maps.event.addListener(
              marker,
              "mouseout",
              mouseOutListener(infoWindow)
            );
            clusterer_2.addMarkers(markers2);
          }
        });
      button_status = 1;
    }
  } else if (button_status == 1) {
    button_status = 0;
    delMarkers_2();
  }
}

// 인포 윈도우 표시 열는 함수입니다.
function mouseOverListener(map, marker, infoWindow) {
  return function () {
    infoWindow.open(map, marker);
  };
}
// 인포윈도우 표시 닫는 함수입니다.
function mouseOutListener(infoWindow) {
  return function () {
    infoWindow.close();
  };
}
/*---------------------------------------------------------------------------------------------------------------------------------*/
