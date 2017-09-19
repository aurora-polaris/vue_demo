<template>
    <div class="header">
      <!--头部上面部分-->
       <div class="content-wrapper">
         <!--logo-->
         <div class="avatar">
           <img :src="seller.avatar" >
         </div>
         <div class="content">
           <!--品牌-->
           <div class="title">
             <span class="brand"></span>
             <span class="name">{{seller.name}}</span>
           </div>
           <div class="description">
            {{seller.description}}/{{seller.deliveryTime}}分钟送达
           </div>
           <!--有数据的时候才会去解析-->
           <div class="support" v-if="seller.supports">
             <span class="icon " :class="classMap[seller.supports[0].type]"></span>
             <span class="text">{{seller.supports[0].description}}</span>
           </div>
         </div>
         <!--5个-->
         <div class="supports_count" v-if="seller.supports" @click="showDetail(true)">
           <span class="count">{{seller.supports.length}}个</span>
           <span class="icon-keyboard_arrow_right"></span>
         </div>
       </div>
      <!--头部下面公告部分-->
       <div class="bulletin-wrapper" @click="showDetail(true)">
         <span class="bulletin-title"></span>
         <span class="bulletin-text">{{seller.bulletin}}</span>
         <span class="icon-keyboard_arrow_right"></span>
       </div>
      <!--背景-->
      <div class="background">
        <img :src="seller.avatar" >
      </div>
      <!--遮罩层部分-->
      <transition name="fade">
        <div class="detail" v-show="detailShow">
          <div class="detail-wrapper">
            <div class="detail-main">
              <div class="name">{{seller.name}}</div>
              <div class="star-wrapper">
                <star :score="seller.score" :size="48"></star>
              </div>
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <ul class="supports" v-if="seller.supports">
                <li class="support" v-for="(support,index) in seller.supports" :key="index">
                  <span class="icon " :class="classMap[support.type]"></span>
                  <span class="text">{{support.description}}</span>
                </li>

              </ul>
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <div class="content">
                <p>{{seller.bulletin}}</p>
              </div>
            </div>
          </div>
          <div class="detail-close" @click="showDetail(false)">
            <span class="icon-close"></span>
          </div>
        </div>
      </transition>

    </div>
</template>
<script>
import star from '../star/star.vue'
    export default{
        //接收属性
      props:{
          seller:Object
      },
      data(){
          return {
              classMap:["decrease", "discount", "guarantee", "invoice", "special"],
              detailShow:false
          }
      },
      methods:{
        showDetail(isShow){
          this.detailShow=isShow
        }
      },
      components:{
          star
      }


    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .header
    position relative
    background-color rgba(7,17,27,0.5)
    color white
    overflow hidden
    .content-wrapper
      position relative
      padding 24px 12px 18px 24px
      overflow hidden
      .avatar
        width 64px
        height 64px
        float left
        &>img
          width 100%
          border-radius 2px
      .content
        margin-left 16px
        float left
        .title
          margin-top 2px
          .brand
            display inline-block
            width 30px
            height 18px
            background-repeat no-repeat
            background-size 30px 18px
            bg-image(brand)
            vertical-align middle
          .name
            font-size 16px
            color rgb(255,255,255)
            font-weight bold
            line-height 18px
            margin-left 6px
        .description
          font-size 12px
          font-weight 200
          line-height 12px
          margin-top 8px
          margin-bottom 6px
        .support
          margin-bottom 2px
          .icon
            display inline-block
            vertical-align middle
            width 12px
            height 12px
            background-repeat no-repeat
            background-size 12px 12px
          .decrease
            bg-image(decrease_1)
          .discount
            bg-image(discount_1)
          .guarantee
            bg-image(guarantee_1)
          .invoice
            bg-image(invoice_1)
          .special
            bg-image(special_1)
          .text
            margin-left 4px
            font-size 10px
            font-weight 200
            line-height 12px
      .supports_count
        background rgba(0,0,0,0.2)
        position absolute
        right 12px
        bottom 18px
        padding 7px 8px
        border-radius 10px
        .count
          font-size 10px
          font-weight 200
          line-height 12px

    .bulletin-wrapper
      background rgba(7,17,27,0.2)
      position relative
      height 28px
      line-height 28px
      padding 0 12px
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
      .bulletin-title
        bg-image(bulletin)
        display inline-block
        vertical-align middle
        background-repeat no-repeat
        width 22px
        height 12px
        background-size 22px 12px
      .icon-keyboard_arrow_right
        position absolute
        top 8px
        right -1px
      .bulletin-text
        font-size 10px
        font-weight 200
        line-height 28px
        margin-left 4px
        margin-right 4px
    .background
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      z-index -1
      &>img
        width 100%
        height 100%
        filter blur(10px)

    .detail
      position fixed
      top 0
      left 0
      background rgba(7,17,27,0.8)
      width 100%
      height 100%
      z-index 100
      /*设置动画效果*/
      &.fade-enter-active,&.fade-leave-active
        transition opacity .5s
      &.fade-enter,&.fade-leave-to
        opacity 0
      .detail-wrapper
        padding 64px 36px 0px
        min-height 100%
        .detail-main
          .name
            font-size 16px
            font-weight 700
            line-height 16px
            text-align center
            margin-bottom 16px
          .star-wrapper
            width 100%
            height 24px

          .title
            margin-top 28px
            margin-bottom 24px
            display flex
            .line
              background  rgba(255,255,255,0.2)
              width 110px
              height 2px
              position relative
              left 0
              top 0
              margin-top 7px
            .text
              font-size 14px
              font-weight 700
              line-height 14px
              margin-left 12px
              margin-right 12px
          .supports
            padding-left 12px
            .support
              height 16px
              margin-bottom 12px
              .icon
                display inline-block
                vertical-align middle
                width 16px
                height 16px
                background-repeat no-repeat
                background-size 16px 16px
              .decrease
                bg-image(decrease_2)
              .discount
                bg-image(discount_2)
              .guarantee
                bg-image(guarantee_2)
              .invoice
                bg-image(invoice_2)
              .special
                bg-image(special_2)
              .text
                font-size 12px
                font-weight 200
                line-height 12px
                margin-left 6px
          .content
            font-size 12px
            font-weight 200
            line-height 24px

      .detail-close
        font-size 32px
        text-align center
        margin-top -128px
        margin-bottom 32px
        color rgba(255,255,255,0.5)
</style>
