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
        }
    }

})();

// UI Controller -- html sayfamız üzerindeki etiketleri temsil eden bölüm
const UIController = (function(){
    const Selectors = {
        productList : "#item-list",
        addButton : '.addBtn',
        productName : '#productName',
        productPrice : '#productPrice',
        productCard : '#productCard'
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
                        <button type="submit" class="btn btn-warning btn-sm updateBtn ">
                            <i class="far fa-edit "></i>
                        </button>
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
                        <button type="submit" class="btn btn-warning btn-sm updateBtn ">
                            <i class="far fa-edit "></i>
                        </button>
                    </td>
                </tr>  
            `;

            document.querySelector(Selectors.productList).innerHTML += item;
        },
        clearInputs : function(){
            document.querySelector(Selectors.productName).value = "";
            document.querySelector(Selectors.productPrice).value = "";
        },
        hideCard : function (){
            document.querySelector(Selectors.productCard).style.display = 'none';
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
    }
    const productAddSubmit = function(e){
        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== '' && productPrice !== ''){
                //add product
            const newProduct = ProductCtrl.addProduct(productName,productPrice);
                //add product to list
            UIController.addProduct(newProduct);    //ekleme işlemi
                //clear inputs
            UIController.clearInputs();             //ekleme işlemi yapıldıktan sonra inputun sıfırlanması.
        }

        console.log(productName,productPrice);
        e.preventDefault();
    }

    return {
        init : function(){
            console.log('Starting app...');
            const products = ProductCtrl.getProducts();

            if (products.length==0){
                UIController.hideCard();
            }else {
                UICtrl.createProductList(products); // UIController modülündeki fonksiyon
                //load event listenner
                
            }
            loadEventListenners();
        }
    }

})(ProductController,UIController);

App.init();
