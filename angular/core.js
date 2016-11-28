app.controller('modificar_contenido',function($scope,$http,$interval){
  modificar_contenido();

  function modificar_contenido(){
  $http.get('http://localhost:3000/load').success(function(data){    
    $scope.profile_pictures=data;
  });
  };
});

app.controller('mostrar_unidades',function($scope,$http,$interval){
  load_data();

  function load_data(){
  $http.post('http://localhost:3000/MostrarUnidades').success(function(data){    
    $scope.profile_pictures=data;
  });
  };
});

app.controller('mostrar_contenido',function($scope,$http,$interval){
  load_data2();

  function load_data2(){
  $http.post('http://localhost:3000/MostrarContenido').success(function(data){    
    $scope.profile_pictures=data;
  });
  };
});

app.controller('mostrar_usuarios',function($scope,$http,$interval){
  load_data3();

  function load_data3(){
  $http.post('http://localhost:3000/MostrarUsuarios').success(function(data){    
    $scope.profile_pictures=data;
  });
  };
});