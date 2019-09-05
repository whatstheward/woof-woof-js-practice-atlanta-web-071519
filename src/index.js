// on page load fetch dogs
// add dogs to dog-bar
// when dog in dog-bar is clicked, info appears in dog-info
// when gooddog/baddog button is clicked 
//  - text should change
//  - dog.object should update
// good dog filter should be clickable
// when toggled only show good dogs if filter is on

document.addEventListener('DOMContentLoaded', ()=>{
    fetchDoggos()
    document.querySelector('#good-dog-filter').addEventListener('click', (e) => toggleFilter(e))
})

function fetchDoggos(){
    fetch('http://localhost:3000/pups')
    .then(res => res.json())
    .then(data => buildDogBar(data))
}

function filterDogs(){
    fetch('http://localhost:3000/pups')
    .then(res => res.json())
    .then(data => {
        const filteredDoggos = data.filter(dog => dog.isGoodDog === true)
        buildDogBar(filteredDoggos)
    })
}

function toggleFilter(e){
    if(e.target.innerText == "Filter good dogs: OFF"){
        e.target.innerText = "Filter good dogs: ON"
        filterDogs()
    }else if(e.target.innerText == "Filter good dogs: ON"){
        fetchDoggos()
        e.target.innerText = "Filter good dogs: OFF"
    }
}

function buildDogBar(dogs){
    const dogBar = document.querySelector('#dog-bar')
    while(dogBar.firstChild){
        dogBar.removeChild(dogBar.firstChild)
    }
    dogs.forEach(dog=>{
        let dogSpan = document.createElement('span')
        dogSpan.dataset.id = dog.id
        dogSpan.innerText = dog.name
        dogSpan.addEventListener('click', (e)=>handleClick(e))
        dogBar.appendChild(dogSpan)
    })
}

function handleClick(e){
    const dogInfo = document.querySelector('#dog-info')
    while(dogInfo.firstChild){
        dogInfo.removeChild(dogInfo.firstChild)
    }
    
    fetchDogInfo(e.target.dataset.id)
}

function fetchDogInfo(id){
    fetch(`http://localhost:3000/pups/${id}`)
    .then(res => res.json())
    .then(data => renderDog(data))
}

function renderDog(dog){
    const dogInfo = document.querySelector('#dog-info')
    
    const dogImg = document.createElement('img')
    dogImg.src = dog.image

    const dogName = document.createElement('h2')
    dogName.innerText = dog.name

    const isGoodDogBtn = document.createElement('button')
    isGoodDogBtn.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"
    isGoodDogBtn.dataset.id = dog.id
    isGoodDogBtn.addEventListener('click', ()=>toggleGoodDog(dog, isGoodDogBtn))

    dogInfo.append(dogImg, dogName, isGoodDogBtn)
}

function toggleGoodDog(dog, btn){
    if(btn.innerText == "Good Dog!"){
        btn.innerText = "Bad Dog!"
    }else if(btn.innerText = "Bad Dog!"){
        btn.innerText = "Good Dog!"
    }
    fetch(`http://localhost:3000/pups/${dog.id}`,{
        method: "PATCH",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isGoodDog: !dog.isGoodDog
        })
    })
}

