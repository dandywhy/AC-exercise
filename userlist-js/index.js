const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/api/v1/users'
const dataPanel = document.querySelector('#user-list')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const favoriteBtn = document.querySelector('.modal-footer')
const userData = []
const USERS_PER_PAGE = 36
let filteredUser = []





axios.get(BASE_URL)
  .then(res => {
    userData.push(...res.data.results)
    renderPaginator(userData.length)
    renderUserList(getUsersByPage(1))
  })
  .catch(err => console.log(err))



function renderUserList(data) {
  dataPanel.innerHTML = data.map(items => {
   return `<div class="col-2 mt-3">
      <div class="card">
        <div class="user-image img">
          <img src=${items.avatar} alt="image" data-bs-toggle="modal" data-bs-target="#user-modal" data-id=${items.id}>
        </div>
        <small class="user-name">${items.name} ${items.surname}</small>
      </div>
    </div>`
  }).join('')
}



function renderUserModal(id) {
  const name = document.querySelector('#modal-name')
  const image = document.querySelector('#modal-image')
  const gender = document.querySelector('#modal-gender')
  const age = document.querySelector('#modal-age')
  const birthday = document.querySelector('#modal-birthday')
  const region = document.querySelector('#modal-region')
  const email = document.querySelector('#modal-email')
  const btn = document.querySelector('#favorite-btn')

  axios.get(BASE_URL +'/' + id)
  .then(res => {
    const modalData = res.data
    
    name.innerText = modalData.name + '' + modalData.surname
    image.innerHTML = `<img src= ${modalData.avatar} alt="image">`
    gender.innerText = modalData.gender
    age.innerText = modalData.age
    birthday.innerText = modalData.birthday
    region.innerText = modalData.region
    email.innerText = modalData.email
    btn.innerHTML = `<button type="button" class="btn btn-primary" id="favorite-btn" data-id=${id}>+</button>`
  })
  .catch(err => console.log(err))
}



function getUsersByPage(page) {
  const data = filteredUser.length ? filteredUser : userData
  //???????????? index 
  const startIndex = (page - 1) * USERS_PER_PAGE
  //???????????????????????????
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)
}



function renderPaginator(amount) {
  //???????????????
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  //?????? template 
  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  //?????? HTML
  paginator.innerHTML = rawHTML
}



function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('Like')) || []
  const user = userData.find((data) => data.id === id)
  
  if (list.some((user) => user.id === id)) {
    return swal('???????????????????????????????????????',{
      icon: "warning"
    })
  }
  swal("???????????????", "" , "success", {
    button: false,
    timer: 1200
  })
  list.push(user)
  localStorage.setItem('Like', JSON.stringify(list))
}



dataPanel.addEventListener('click', event => {
  const id = event.target.dataset.id
  if (event.target.matches('.user-image img')) {
    renderUserModal(id)
  } 
})



searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredUser = userData.filter((data) =>
    data.name.toLowerCase().includes(keyword) || data.surname.toLowerCase().includes(keyword)
  )
  //???????????????????????????????????????
  if (filteredUser.length === 0) {
    return alert('???????????????????????????')
  }
  // ???????????????
  renderPaginator(filteredUser.length)  
  //??????????????? 1 ??????????????????
  renderUserList(getUsersByPage(1))
})



paginator.addEventListener('click', function onPaginatorClicked(event) {
  //???????????????????????? a ???????????????
  if (event.target.tagName !== 'A') return

  //?????? dataset ????????????????????????
  const page = Number(event.target.dataset.page)
  //????????????
  renderUserList(getUsersByPage(page))
})



favoriteBtn.addEventListener('click', event => {
  const id = event.target.dataset.id

  if (event.target.matches('.btn-primary')) {
    addToFavorite(Number(id))
  }
})