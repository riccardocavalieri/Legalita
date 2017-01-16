angular.module('legalitaGameApp', [])
  .controller('AvatarController', function () {
      console.log("start controller");
      var avatars = this;
      avatars.current = null;
      avatars.available = [
		{ id: "1", img: "avatar-1.png" },
		{ id: "2", img: "avatar-2.png" },
		{ id: "3", img: "avatar-3.png" },
		{ id: "4", img: "avatar-4.png" },
		{ id: "5", img: "avatar-5.png" },
		{ id: "6", img: "avatar-6.png" },
		{ id: "7", img: "avatar-7.png" },
		{ id: "8", img: "avatar-8.png" }
      ];

      /*
      var todoList = this;
      todoList.todos = [
        {text:'learn angular', done:true},
        {text:'build an angular app', done:false}];
 
      todoList.addTodo = function() {
          todoList.todos.push({text:todoList.todoText, done:false});
          todoList.todoText = '';
      };


      avatars.getAvailableAvatars = function () {
          console.log("start");
          $.getJSON( "json/avatars.json", function( data ) {
              avatars.available = data.avatars;
          });
          console.log("end");
          return  avatars.available;
      };

      todoList.archive = function() {
          var oldTodos = todoList.todos;
          todoList.todos = [];
          angular.forEach(oldTodos, function(todo) {
              if (!todo.done) todoList.todos.push(todo);
          });
      };
      */
  })
.controller('TemiController', function () {
    var temi = this;
    temi.available = [
        { id: "1", nome: "Scuola", img: "img/tema-1.png" },
        { id: "2", nome: "Social Network", img: "img/tema-2.png" },
        { id: "3", nome: "Mafia", img: "img/tema-3.png" },
        { id: "4", nome: "Giochi", img: "img/tema-4.png" },
        { id: "5", nome: "Famiglia", img: "img/tema-5.png" }
    ];
});