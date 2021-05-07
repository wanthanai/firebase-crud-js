//! Element
let form = document.querySelector('#add_user');
let userList = document.querySelector('.user_list');

//! Get data
// db.collection('users').where('city', '==', 'bangkok').orderBy('name').get().then((users) => {
//     users.docs.forEach(doc => {
//         // console.log(doc);
//         renderUser(doc);
//     })
// })

//! Add data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    db.collection('users').add({
        name: form.name.value,
        city: form.city.value
    })

    e.target.name.value = ''
    e.target.city.value = ''

    console.log('add success!');
})

//! Show data
const renderUser = (doc) => {
    // element add data
    let userItem = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let del = document.createElement('button');
    // element update data
    let formEdit = document.createElement('form');
    let editName = document.createElement('input');
    let editCity = document.createElement('input');
    let btnEdit = document.createElement('button');

    // add data option
    userItem.setAttribute('data-id', doc.id);
    userItem.className = "user_item";
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    name.className = "user_name"
    city.className = "user_city"
    del.textContent = "X"
    del.className = "del_user"
    // update data option
    formEdit.setAttribute('action', "");
    formEdit.setAttribute('data-formId', doc.id);
    formEdit.id = 'update_user';
    editName.setAttribute('type', 'text');
    editName.setAttribute('name', 'name');
    editName.setAttribute('placeholder', 'edit name');
    editCity.setAttribute('type', 'text');
    editCity.setAttribute('name', 'city');
    editCity.setAttribute('placeholder', 'edit city');
    btnEdit.textContent = 'save';
    btnEdit.setAttribute('type', 'submit');

    // add data append
    userItem.appendChild(name)
    userItem.appendChild(city)
    userItem.appendChild(del)
    // updata data append
    formEdit.appendChild(editName);
    formEdit.appendChild(editCity);
    formEdit.appendChild(btnEdit);
    userItem.appendChild(formEdit);
    userList.appendChild(userItem)

    //! Delete data
    del.addEventListener('click', (e) => {
        let id = e.target.parentElement.getAttribute('data-id');

        db.collection('users').doc(id).delete();
        console.log('delete success!');
    });

    //! Update data
    formEdit.addEventListener('submit', (e) => {
        e.preventDefault();
        let id = formEdit.getAttribute('data-formId');
        
        if(formEdit.name.value === '' && formEdit.city.value === '') {
            return;
        }  
        if(formEdit.name.value !== '' && formEdit.city.value !== '') {
            db.collection('users').doc(id).update({
                name: formEdit.name.value,
                city: formEdit.city.value
            })
        }
        if(formEdit.name.value !== '' && formEdit.city.value === '') {
            return;
        }
        if(formEdit.name.value === '' && formEdit.city.value !== '') {
            return;
        }
 
        formEdit.name.value = '';
        formEdit.city.value = '';
    })
}

//! real-time database && Get data
db.collection('users').orderBy('name').onSnapshot(users => {
    let changes = users.docChanges();
    changes.forEach(change => {
        // console.log(change)

        if(change.type === 'added') {
            renderUser(change.doc)
        } else if(change.type === 'removed') {
            let li = userList.querySelector(`[data-id=${change.doc.id}]`);
            userList.removeChild(li);
        }
        //! Update data 
        else if(change.type === 'modified') { 
            let li = userList.querySelector(`[data-id=${change.doc.id}]`);
            let name = li.querySelector(`.user_name`);
            let city = li.querySelector(`.user_city`);

            name.textContent = change.doc.data().name;
            city.textContent = change.doc.data().city;
        }
    })
})
