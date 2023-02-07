import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'ConvertersController.index').middleware('auth')
Route.get('/converter', 'ConvertersController.index').middleware('auth')
Route.post('/processar', 'ProcessosController.process').middleware('auth')
Route.get('/converter-form', 'ConverterExcelsController.form').middleware('auth')
Route.post('/converter-excel', 'ConverterExcelsController.convert').middleware('auth')

Route.group(() => {
  Route.get('/', 'EmpresasController.index')
  Route.get('/:id', 'EmpresasController.edit')
  Route.post('/', 'EmpresasController.create')
  Route.post('/:id', 'EmpresasController.update')
  Route.delete('/:id', 'EmpresasController.delete')
}).prefix('/empresas').middleware('auth')

Route.group(() => {
  Route.get('/', 'PessoasController.index')
  Route.get('/:id', 'PessoasController.edit')
  Route.post('/', 'PessoasController.create')
  Route.post('/:id', 'PessoasController.update')
  Route.delete('/:id', 'PessoasController.delete')
}).prefix('/pessoas').middleware('auth')

Route.group(() => {
  Route.get('/', 'OrdensController.index')
  Route.get('/:id', 'OrdensController.edit')
  Route.post('/', 'OrdensController.create')
  Route.post('/:id', 'OrdensController.update')
  Route.delete('/:id', 'OrdensController.delete')
}).prefix('/ordens').middleware('auth')

Route.get('/register', 'AuthController.showRegister').middleware('guest')
Route.post('/register', 'AuthController.register')
Route.post('/logout', 'AuthController.logout')
Route.get('/login', 'AuthController.showLogin').middleware('guest')
Route.post('/login', 'AuthController.login')
