const startButton = document.querySelector('#start');
const dialog = document.querySelector('#dialog');
const mainDiv = document.querySelector('.main');
const closeButton = document.querySelector('#close');

function openPopup(){
    dialog.showModal();
    mainDiv.style.filter="blur(10px)";
    mainDiv.style.opacity=0.3;
};

function closePopup(){
    dialog.close();
    mainDiv.style.opacity=1;
    mainDiv.style.filter="blur(0)";

}

closeButton.addEventListener('click',closePopup);
startButton.addEventListener('click',openPopup);
document.addEventListener('keydown',function(event){
    if(event.key==='Escape'){
        closePopup();
    }
});


