(() => {
    var App = {
        htmlElements: {

            formTasks: document.getElementById('form_tasks'),
            divList: document.getElementById('div_lista'),
            textInput: document.getElementById('txt_input')

        },

        init: () => {
            App.bindEvents();
            App.initializeData.tasks();
        },

        bindEvents: () => {

            App.htmlElements.formTasks.addEventListener('submit', App.events.onTaskInsert)

        },

        initializeData: {
            tasks: async () => {
                const { count, data } = await App.endpoints.getTasks(); 
                data.forEach(Tasks => {
                    App.utils.addTask(Tasks);
                });
            }
        },

        events: {

            
            onTaskInsert: async (e) => {

                e.preventDefault();

                App.htmlElements.divList.innerHTML = "";

                const { 
                    
                    tarea,
                    categoria
                    
                } = e.target.elements;

                const varTarea = tarea.value;
                const varCategoria = categoria.value;



                await App.endpoints.postTask({
                    task: varTarea,
                    category: varCategoria
                });

                App.htmlElements.textInput.value = "";

                App.initializeData.tasks();

                
            },

            onTaskUpdate: async (e) => {

                e.preventDefault();

                var idtask = e.target.className;
                var categoria = document.getElementById(`droplist_fin_${idtask}`).value;
                var tarea = document.getElementById(`txt_input_fin_${idtask}`).value;

                                
                await App.endpoints.updateTask(

                    {
                        task: tarea,
                        category: categoria,
                        id: idtask
    
                    },{
    
                        id: idtask
    
                    });
                
                App.htmlElements.divList.innerHTML = "";
                App.initializeData.tasks();

                
            },



            onTaskDelete: async (e) => {

                App.htmlElements.divList.innerHTML = "";
                
                e.preventDefault();

                var id = e.currentTarget.className;

                await App.endpoints.deleteTask({

                    id: id 

                });

                App.initializeData.tasks();

                
            },

            onClickUpdate: async (e) => {

                e.preventDefault();
                
                //Tomar el id de la tarea
                var id = e.currentTarget.className;

                //Tomar la categoria de la tarea.
                var categoria = document.getElementById(`div_categoria_${id}`).textContent;

                //Tomar el contenido de la tarea.
                var contenido = document.getElementById(`task_${id}`).textContent;

                //Vacia el contenido del Div padre.
                document.getElementById(`fila_contenedor_interior_${id}`).innerHTML = "";

                //Inserta el nuevo HTML dentro de la tarea existente.
                document.getElementById(`fila_contenedor_interior_${id}`).innerHTML = 
                
                `
                <form id="form_in_${id}" class=${id}>

                    <input name="tarea" type="text" id="txt_input_fin_${id}" class="${id}" value="${contenido}">
                    
                    <select name="categoria" id="droplist_fin_${id}" class="${id}">
                        <option value="Personal">Personal</option>
                        <option value="Laboral">Laboral</option>
                        <option value="Educativo">Educativo</option>
                        <option value="Recordatorio">Recordatorio</option>
                    </select>

                    <button type="submit" id="btn_guardar_fin_${id}" class="${id}">Guardar</button>

                </form>
                `;

            document.getElementById(`droplist_fin_${id}`).value = categoria;

            document.getElementById(`btn_guardar_fin_${id}`).addEventListener('click', App.events.onTaskUpdate)

            },

            onTaskCheck: async (e) => {
                
                var id = e.target.id;
                var clase = e.target.className;

                if (document.getElementById(id).checked){

                    await App.endpoints.updateCheck({

                        id: clase,
                        status: "checked" 
    
                    },{

                        id: clase

                    });

                    document.getElementById(`btn_editar_${clase}`).setAttribute('disabled', true);


                }

                else {

                    await App.endpoints.updateCheck({

                        id: clase,
                        status: ""
    
                    },{

                        id: clase

                    });

                    document.getElementById(`btn_editar_${clase}`).removeAttribute('disabled');

                }



            },


        },


        endpoints: {


            getTasks: () => {
                return App.utils.get("http://localhost:3000/api/v1/tasks/");
            },

            postTask: (payload) => {
                return App.utils.post("http://localhost:3000/api/v1/tasks/", payload);
            },

            deleteTask: (id) => {
                return App.utils.delete("http://localhost:3000/api/v1/tasks/", id);
            },

            updateCheck: (payload, id) => {
                return App.utils.patch("http://localhost:3000/api/v1/tasks/", payload, id);
            },

            updateTask: (payload, id) => {
                return App.utils.put("http://localhost:3000/api/v1/tasks/", payload, id);
            }


        },


        utils: {


            get: async (url, method) => {
                const requestOptions = { method };
                const response = await fetch(url, requestOptions);
                return response.json();
            },

            post: async (url, body = {}) => {

                const response = await fetch(url, {
                  method: "POST", 
                  mode: "cors", 
                  cache: "no-cache", 
                  credentials: "same-origin", 
                  headers: { "Content-Type": "application/json",},
                  redirect: "follow", 
                  referrerPolicy: "no-referrer", 
                  body: JSON.stringify(body), 
                });

                return await response.json();
            },

            delete: async (url = "", id) => {
                const response = await fetch(url + id, {
                  method: "DELETE",
                  mode: "cors", 
                  cache: "no-cache", 
                  credentials: "same-origin", 
                  headers: { "Content-Type": "application/json",},
                  redirect: "follow", 
                  referrerPolicy: "no-referrer", 
                  body: JSON.stringify(id), 
                });
                return await response.json();
            },

            patch: async (url = "", data = {}, id) => {

                const response = await fetch(url + id, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                });
                return response.json();
            },

            put: async (url = "", data = {}, id) => {
                const response = await fetch(url + id, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(data),
                });
                return response.json();
            },




            //Puebla la lista
            addTask: ({ id, task, category, status }) => {

                var div_fila = document.createElement("div");

                var attributo = ""

                if (status == "checked"){

                    attributo = "disabled=true"

                }

                div_fila.innerHTML =
                
                    
                `<div id=fila_contenedor_interior_${id} class=${id}>
                
                    <div id="div_tarea_g">
                        <div id="div_tarea" class=div_tarea_${id}>
                            <input id="chk_box_${id}" class="${id}" type="checkbox" ${status}>
                            <label for="chk_box_${id}" id="task_${id}" >${task}</label>
                        </div>
                            <div id="div_categoria_${id}">${category}</div>    
                    </div>
                    
                    <div id="div_editar" class="${id}">
                        <button id="btn_editar_${id}" class="${id}" ${attributo}><i class="fas fa-edit fa-lg"></i></button>
                    </div>

                    <div id="div_eliminar" class="${id}">
                        <button id="btn_eliminar_${id}" class="${id}"><i class="fas fa-trash-alt fa-lg"></i></button>
                    </div>
                
                </div>`;

                div_fila.id = "div_fila";
                div_fila.class = id;

                App.htmlElements.divList.appendChild(div_fila);

                document.getElementById(`btn_eliminar_${id}`).addEventListener('click', App.events.onTaskDelete)
                document.getElementById(`btn_editar_${id}`).addEventListener('click', App.events.onClickUpdate)
                document.getElementById(`chk_box_${id}`).addEventListener('change', App.events.onTaskCheck)
                
            }

            
        }
    };
    App.init()
})();