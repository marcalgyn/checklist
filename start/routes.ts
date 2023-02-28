import Route from "@ioc:Adonis/Core/Route";

Route.get("/", "HomeController.index").middleware("auth");
Route.get("/home", "HomeController.index").middleware("auth");
Route.get("/welcome", "HomeController.welcome").middleware("guest");

Route.group(() => {
  Route.get("/", "EmpresasController.index");
  Route.get("/:id", "EmpresasController.edit");
  Route.post("/", "EmpresasController.create");
  Route.post("/:id", "EmpresasController.update");
  Route.delete("/:id", "EmpresasController.delete");
})
  .prefix("/empresas")
  .middleware("auth");

Route.group(() => {
  Route.get("/", "PessoasController.index");
  Route.get("/:id", "PessoasController.edit");
  Route.post("/", "PessoasController.create");
  Route.patch("/:id", "PessoasController.activate");
  Route.delete("/:id", "PessoasController.delete");
})
  .prefix("/pessoas")
  .middleware("auth");

Route.group(() => {
  Route.get("/", "TarefaController.index");
  Route.get("/:id", "TarefaController.edit");
  Route.post("/", "TarefaController.create");
  Route.patch("/:id", "TarefaController.finalize");
  Route.delete("/:id", "TarefaController.delete");
})
  .prefix("/tarefas")
  .middleware("auth");

Route.get("/register", "AuthController.showRegister").middleware("guest");
Route.post("/register", "AuthController.register");
Route.post("/logout", "AuthController.logout");
Route.get("/login", "AuthController.showLogin").middleware("guest");
Route.post("/login", "AuthController.login");
