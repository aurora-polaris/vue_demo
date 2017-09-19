<template>
    <div>
      <!--商品主页-->
      <div class="goods">
        <!--左侧部分-->
        <div class="menu-wrapper" ref="menuLeft">
           <ul>
             <li class="menu-item" v-for="(good,index) in goods" :key="index"
                 :class="{current:currIndex==index}" @click="clickMenu(index)">
               <span class="text border-1px">
                 <span class="icon " v-if="good.type>=0 " :class="classMap[good.type]"></span>{{good.name}}
               </span>
             </li>
           </ul>
        </div>
        <!--右侧部分-->
        <div class="foods-wrapper" ref="menuRight">
          <ul>
            <li class="food-list food-list-hook"  v-for="good in goods" >
             <h1 class="title">{{good.name}}</h1>
              <ul>
                <li class="food-item border-1px" v-for="food in good.foods" @click="showFood(food)">
                  <div class="icon">
                    <img width="57" height="57" :src="food.icon">
                  </div>
                  <div class="content">
                    <h2 class="name">{{food.name}}</h2>
                    <p class="desc">{{food.description}}</p>
                    <div class="extra">
                      <span class="count">月售{{food.sellCount}}份</span>
                      <span>好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                      <span class="now">￥{{food.price}}</span>
                      <span class="old" style="display: none;">￥</span>
                    </div>
                    <!--加减订单-->
                    <div class="cartcontrol-wrapper">
                      <cartcontrol :food="food" :updateFoodCount="updateFoodCount"></cartcontrol>
                    </div>
                  </div>
                </li>
              </ul>
               </li>
          </ul>
        </div>
         <!--底部购物车-->
        <shopcart :foods="selectedFoods" :deliveryPrice="seller.deliveryPrice"
                  :minPrice="seller.minPrice" :clearCart="clearCart" :updateFoodCount="updateFoodCount">
        </shopcart>
      </div>
      <!--单个商品详情,使用标识，让父组件调用子组件的内容-->
     <food :food="food" :updateFoodCount="updateFoodCount" ref="food"></food>
    </div>
</template>
<script>
  import axios from 'axios'
  import BScroll from 'better-scroll'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import shopcart from '../shopcart/shaopcart.vue'
  import food from '../food/food.vue'
    export default{
      props:{
          seller:Object
      },
        data(){
            return {
              goods:[],
              classMap: ["decrease", "discount", "guarantee", "invoice", "special"],
              tops:[],
              scrollY:0,
              food:{}
            }
        },
      mounted(){
            //ajax请求获取goods数据
            axios.get('/api2/goods')
              .then(response=>{
                  const result=response.data
                  if(result.code===0){
                      this.goods=result.data
                    /*创建scroll对象,更新数据以后就会去更新界面，更新界面是异步操作
                      但是这里会在this._initScroll() 执行后才会更新界面
                      使用定时器操作可以解决这个问题，但是我们无法判断延迟的时间为多少是合适的
                    */
                   /* setTimeout(()=>{
                      this._initScroll()
                    },100)*/
                   /*  vm.$nextTick([callback])将回调延迟到下次DOM更新循环之后再执行,与全局方法vue.nextTick（）是一样,不同的是这里回调的this
                   可以自动绑定到调用他的实例上
                   * */
                    this.$nextTick(()=>{
                        this._initScroll() //初始化滚动对象
                        this._initTops()  //初始化tops数组

                    })
                  }
              })
      },
      methods:{
          _initScroll(){
              //创建左侧列表的scroll对象
           /*new BScroll(this.$refs.menuLeft,{
             click:true  //响应点击 默认值为false
             })*/
           new BScroll(this.$refs.menuLeft, {
               click: true
           })
            //创建右侧列表的scroll对象
            this.foodsScroller=new BScroll(this.$refs.menuRight,{
                probeType:3,  //标识分发scroll事件，绑定scroll回调函数会调用
                click:true   //点击添加时会触发
            })
            /*probeType 默认值是0 档位1时，会非实时（屏幕滑动超过一定时间后）派发scroll事件，位2时，会在
            * 屏幕滑动的过程中实时派发scroll事件，为3时不仅在滑动过程中，而且在monentum
            * 滚动动画运行过程中实时触发scroll事件*/
            //监视foods裂变的滚动

            this.foodsScroller.on('scroll',  (event) => {
              if(!this.clickList) {
                this.scrollY = Math.abs(event.y)
              }

            })
            this.foodsScroller.on('scrollEnd', (event) => {
              this.clickList = false

            })


          },
          _initTops(){
              //准备一个空数组
          const tops=[]
          let top=0
          tops.push(top)
          //获取所有的li
          const lis=this.$refs.menuRight.getElementsByClassName('food-list-hook')
          Array.prototype.slice.call(lis).forEach(li=>{
              top+=li.clientHeight
              tops.push(top)
          })
          //更新状态
          this.tops=tops
        },
          clickMenu(index){
          //修改标识属性，解决左侧点击滑动问题
          this.clickList=true
          this.scrollY=this.tops[index]

            //滚动的目标li
          const li=this.$refs.menuRight.getElementsByClassName('food-list-hook')[index]
           //scrollToElement（）滚动到指定的目标元素
          this.foodsScroller.scrollToElement(li,300)

        },
          updateFoodCount(food,isAdd){
              if(isAdd){
                  /*第一次点击时，初始的第一个数值为1，也就是必须从1开始增加*/
                  if(!food.count){
                      /*food.count=1  给对象添加新的属性没有数据绑定，使用vue提供的方法$set(target,key,value)*/
                      this.$set(food,'count',1)
                }
                else{
                      food.count++
                  }
              }
              else{
                  if(food.count){
                      food.count--
                  }
              }

          },
        /*清空购物车*/
        clearCart(){
              this.selectedFoods.forEach(food=>{
                  food.count=0
              })
          },
        showFood(food){
            this.food=food
          //显示
            this.$refs.food.show(true)
        }

      },
      computed:{
          currIndex(){
              const {tops,scrollY}=this
            //findIndex() 每个返回true的回调所对应的index，scrollY大于当前的top值小于后面的top值
              return tops.findIndex((top,index)=>{
                  return scrollY>=top && scrollY<tops[index+1]
              })
          },
        /*选择食物添加到购物车*/
        selectedFoods(){
          const foods=[]
          this.goods.forEach(good=>{
              good.foods.forEach(food=>{
                  food.count && foods.push(food)
              })
          })
          return foods
        }
      },
      components:{
        cartcontrol,
        shopcart,
        food
      }
    }
</script>
<style  lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
