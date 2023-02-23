//select elements
const form= document.getElementById("toDoForm")
const toDoInput= document.getElementById("newToDo")
const toDoListElements= document.getElementById("toDoList")
const notification= document.querySelector('.notification');

// I need to define an empty Array


let ToDo=JSON.parse(localStorage.getItem('ToDo')) || [];
let EditToDoId=-1;
renderToDo();
//form submit
form.addEventListener('submit', function(event){
    event.preventDefault();
    saveToDo()
    renderToDo()
    localStorage.setItem('ToDo', JSON.stringify(ToDo));
});

//here i will call my function SaveToDo
function saveToDo(){
    const todoValue=toDoInput.value;
    //Check if the function is empty
    const isEmpty=todoValue ==='';
    //Check if the value is duplicate
    const isDuplicate = ToDo.some((toDo)=> toDo.value.toUpperCase()===todoValue.toUpperCase());

    if(isEmpty){
    ShowNotification("The ToDo's input is empty");
    }else if(isDuplicate){
        ShowNotification("The ToDo is already in the list");
    }else{
        if(EditToDoId>=0){
            ToDo = ToDo.map((toDo, index)=>({
                ...toDo, 
                value : index===EditToDoId ? todoValue:toDo.value,
            }));

            EditToDoId=-1;
        }else{
            ToDo.push({

                value:todoValue,
                checked: false,
                color:'#'+ Math.floor(Math.random()*16777215).toString(16)
            });

        }
      
        //Now we have to clear the input after to puch the submit button
        toDoInput.value='';
       
}

}
function renderToDo() {

    if(ToDo.lengt===0){
        toDoListElements.innerHTML='<center>Nothing todo!</center>';
        return;

    }
    //We need to clean the list before to re-render
    toDoListElements.innerHTML='';

    //Render the ToDo's
    ToDo.forEach((toDo, index)=>{
        toDoListElements.innerHTML+= ` 
        <div class="toDo" id=${index}>
            <i 
            class="bi ${toDo.checked ?'bi-check-circle-fill': 'bi-circle'}"
            style="color : ${toDo.color}"
            data-action="check"
            ></i> 
            <p class="${toDo.checked ?'checked': ''}"  data-action="check">${toDo.value}</p>
            <i class="bi bi-pencil-square"  data-action="edit"></i>
            <i class="bi bi-trash"  data-action="delete"></i>
           
        </div>`

    })

}

//Cliclek on our event listener 

toDoListElements.addEventListener('click', (event)=>{
    const target = event.target;
    const parentElement = target.parentNode;
    if (parentElement.className !=='toDo') return; 
    const toDo= parentElement;
    const toDoId=Number(toDo.id);

    const action= target.dataset.action;
    action === "check" && checkToDo(toDoId);
    action === "edit" && editToDo(toDoId);
    action === "delete" && deleteToDo(toDoId);



    console.log(toDoId, action);
})

// check todo 

function checkToDo(toDoId){
    ToDo=ToDo.map((toDo, index)=>({
    ...toDo,
    checked: index===toDoId ? !toDo.checked : toDo.checked,
    }))
    renderToDo();
    localStorage.setItem('ToDo', JSON.stringify(ToDo));
}
function editToDo(toDoId){
    toDoInput.value= ToDo[toDoId].value;
    EditToDoId=toDoId;

}
function deleteToDo(toDoId){
    ToDo= ToDo.filter((toDo, index)=> index !== toDoId);
    EditToDoId = -1;
    renderToDo();
     localStorage.setItem('ToDo', JSON.stringify(ToDo));

}

//CREATE NOTIFICATIONS 
function ShowNotification(message){
    notificationEL.innerHTML = message;
    //esto irá en mi css
    notificationEl.classList.add('notif-enter');

    setTimeout(()=>{
        notificationEL.classList.remove('notif-enter')
    }, 2000)


}
