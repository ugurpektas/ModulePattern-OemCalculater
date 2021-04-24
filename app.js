// Storage Controller   -- kullanıcıdan alınan bilgileri tarayıcıya aktarma
const StorageController = (function(){

})();

// Product Controller -- Ürün bilgilerini temsil eden kısım
const ProductController     = (function(){

    //private alan
    const Product = function(id,name,price){    //prive alan -- constructor
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {  
        products : [
            {id : 1, name :"Monitör" , price : 100},
            {id : 2, name :"Ram" , price : 30},
            {id : 3, name :"Klavye" , price : 10},
            {id : 4, name :"Mouse" , price : 5}
        ],
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
        }
    }

})();

// UI Controller -- html sayfamız üzerindeki etiketleri temsil eden bölüm
const UIController = (function(){
    const Selectors = {
        productList : "#item-list"
    }
    
    return {
        createProductList : function (products){
            let html = '';

            products.forEach(prd => {
                html+= `
                <tr>
                    <td>${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price}</td>
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
        }
    }

})();

// App Controller -- Modüllerin birleştiği ANA MODÜL
const App = (function(ProductCtrl,UICtrl){

    return {
        init : function(){
            console.log('Starting app...');
            const products = ProductCtrl.getProducts();
            
            UICtrl.createProductList(products); // UIController modülündeki fonksiyon
        }
    }

})(ProductController,UIController);

App.init();
