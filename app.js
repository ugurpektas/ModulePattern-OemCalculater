    // Storage Controller   -- kullanıcıdan alınan bilgileri tarayıcıya aktarma
const StorageController = (function(){

})();

    // Product Controller -- Ürün bilgilerini temsil eden kısım
const ProductController = (function(){
    //private alan
    const Product = function(id,name,price){    //prive alan -- constructor
        this.id = id;
        this.name = name;
        this.price = price;
    }
    const data = {  
        products : [],                  //inputtan girilen değerlerin bulunduğu liste
        selectedProduct : null,         //seçilen ürünlerin aktarıldığı değişken
        totalPrice : 0                  //seçilen listedeki fiyat toplamını bize verecek olan değişken
    }

    //public alan --dışa aktarılan Ana modülde görülecek olan kısım
    return {
        getProducts : function(){
            return data.products;
        },
        getData : function(){
            return data;
        },
        getProductById : function (id){
            let product = null;

            data.products.forEach(function(prd){
                if(prd.id == id){
                    product = prd;
                }
            });

            return product;
        },
        setCurrentProduct : function (product){
            data.selectedProduct = product;
        },
        getCurrentProduct : function (){
            return data.selectedProduct;
        },
        addProduct : function (name,price){
            let id;
            if(data.products.length >0){
                id = data.products[data.products.length-1].id+1;
            }else {
                id = 0;
            }
            const newProduct = new Product(id,name,parseFloat(price));
            data.products.push(newProduct);
            return newProduct;
        },
        updateProduct : function(name,price){
            let product = null;

            data.products.forEach(function(prd){
                if (prd.id == data.selectedProduct.id){
                    prd.name = name;
                    prd.price = parseFloat(price);

                    product = prd;
                }
            });

            return product;
        },
        getTotal : function (){
            let total = 0;

            data.products.forEach(function(item){   // girilen fiyat değerlerini toplayarak yazdırma
                total += item.price;
            });

            data.totalPrice = total;                

            return data.totalPrice;                 //toplam fiyat değerini geri döndürme
        }
    }

})();

// UI Controller -- html sayfamız üzerindeki etiketleri temsil eden bölüm
const UIController = (function(){
    const Selectors = {
        productList : "#item-list",
        productListItem : '#item-list tr',
        addButton : '.addBtn',
        updateButton : '.updateBtn',
        deleteButton : '.deleteBtn',
        cancelButton : '.cancelBtn',
        productName : '#productName',
        productPrice : '#productPrice',
        productCard : '#productCard',
        totalTl : '#total-tl',
        totalDolar : '#total-dolar'
    }
    
    return {
        createProductList : function (products){
            let html = '';

            products.forEach(prd => {
                html+= `
                <tr>
                    <td>${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price} $</td>
                    <td class="text-right">
                        <i class="far fa-edit edit-product"></i>
                    </td>
                </tr>
                `;
            });


            document.querySelector(Selectors.productList).innerHTML += html;
        },
        getSelectors : function (){
            return Selectors;
        },
        addProduct : function (prd){
            document.querySelector(Selectors.productCard).style.display= 'block';
            var item = `
                <tr>
                    <td>${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price} $</td>
                    <td class="text-right">
                        <i class="far fa-edit edit-product"></i>
                    </td>
                </tr>  
            `;

            document.querySelector(Selectors.productList).innerHTML += item;
        },
        updateProduct : function(prd){
            let updatedItem = null;

            let items = document.querySelectorAll(Selectors.productListItem);
            items.forEach(function(item){
                if (item.classList.contains('bg-warnig')){
                    item.children[1].textContent = prd.name;
                    items.children[2].textContent = prd.price + '$'; 

                    updatedItem = item;
                }
            });
            return updatedItem;
        },
        clearInputs : function(){
            document.querySelector(Selectors.productName).value = "";
            document.querySelector(Selectors.productPrice).value = "";
        },
        hideCard : function (){
            document.querySelector(Selectors.productCard).style.display = 'none';
        },
        showTotal : function (total){
            document.querySelector(Selectors.totalDolar).textContent = total;                    //toplam dolar fiyatının gösterilmesi
            document.querySelector(Selectors.totalTl).textContent = ((total*8.37).toFixed(2)) ;  //dolar kurunun üzerinden tl karşılığının gösterilmesi
        },
        addProductToForm : function (){
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price;
        },
        addingState : function (item){
            if (item){
                item.classList.remove('bg-warning');
            }
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display = 'inline';
            document.querySelector(Selectors.updateButton).style.display = 'none';
            document.querySelector(Selectors.deleteButton).style.display = 'none';
            document.querySelector(Selectors.cancelButton).style.display = 'none';
        },
        editState : function (tr){

            const parent = tr.parentNode;
            for (let i=0; i<parent.children.length;i++){
                parent.children[i].classList.remove('bg-warning');
            }
            tr.classList.add('bg-warning');

            document.querySelector(Selectors.addButton).style.display = 'none';
            document.querySelector(Selectors.updateButton).style.display = 'inline';
            document.querySelector(Selectors.deleteButton).style.display = 'inline';
            document.querySelector(Selectors.cancelButton).style.display = 'inline';
        }
    }

})();

// App Controller -- Modüllerin birleştiği ANA MODÜL
const App = (function(ProductCtrl,UICtrl){
    const UISelectors = UIController.getSelectors();    // UIcontroller içerisindeki selectorları App içerisinden ulaşılabilir yapmak

    //Load event listenner -- app modülü çalıştığında eventler çağırılmış olucak
    const loadEventListenners = function (){
            // add product event
        document.querySelector(UISelectors.addButton).addEventListener('click', productAddSubmit);

            // edit product click
        document.querySelector(UISelectors.productList).addEventListener('click', productEditClick);

            // edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener('click', editProductSubmit);

    }
    const productAddSubmit = function(e){
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== ''){
            //add product
            const newProduct = ProductCtrl.addProduct(productName,productPrice);

            //add product to list
            UIController.addProduct(newProduct);    //ekleme işlemi

            //get total
            const total = ProductCtrl.getTotal();
            
            //show total
            UIController.showTotal(total);

            //clear inputs
            UIController.clearInputs();             //ekleme işlemi yapıldıktan sonra inputun sıfırlanması.
        }

        console.log(productName,productPrice);
        e.preventDefault();
    }
    const productEditClick = function(e){
        let element = e.target;
        if (element.classList.contains('edit-product')){
            const id = element.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
            
            //get selected product
            const product = ProductCtrl.getProductById(id);
            
            //set current product   // edit için seçilen ürünlerin bilgisini set etmek
            ProductCtrl.setCurrentProduct(product);

            //add product to ui     // set edilen ürünleri ekrana gösterme
            UICtrl.addProductToForm();
            
            UICtrl.editState(element.parentNode.parentNode);
        }
        e.preventDefault();
    }
    const editProductSubmit = function(e){
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if(productName !== '' && productPrice !==''){

            //update product
            const updateProduct = ProductCtrl.updateProduct(productName,productPrice);

            //update ui
            let  item = UICtrl.updateProduct(updateProduct);
            
            //get total
            const total = ProductCtrl.getTotal();
            
            //show total
            UICtrl.showTotal(total);

            //
            UICtrl.addingState(item);
        }

        e.preventDefault();
    }

    return {
        init : function(){
            console.log('Starting app...');

            UICtrl.addingState();
            const products = ProductCtrl.getProducts();

            if (products.length==0){
                UICtrl.hideCard();
            }else {
                UICtrl.createProductList(products);         // UIController modülündeki fonksiyon                
            }
            //load event listenner
            loadEventListenners();
        }
    }

})(ProductController,UIController);

App.init();
