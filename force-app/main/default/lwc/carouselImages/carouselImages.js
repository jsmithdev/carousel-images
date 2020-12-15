import { api, LightningElement } from 'lwc';

export default class CarouselImages extends LightningElement {

    @api width 
    @api height = 'auto'
    @api files = [
        {
            title: 'Playing Puppy',
            url: 'https://i.imgur.com/WAKkegn.jpg',
        },
        {
            title: 'Tired Puppy',
            url: 'https://i.imgur.com/eF77hcc.jpg',
        },
    ]

    active = 0

    get indicators(){
        return Array.from(Array(this.files.length).keys()).map(index => {
            return {
                index,
                key: `panel_${index}_indicator`,
                classes: `panel_${index}_indicator slds-carousel__indicator`
            }
        })
    }
    get value(){
        return this.data
    }
    get max(){ return this.files.length }

    get count(){
        return `${this.active+1} of ${this.max}`
    }
    get button_next_disabled(){
        return (this.active + 1) === this.max
    }
    get button_prev_disabled(){
        return this.active=== 0
    }

    get container(){ return this.template.querySelector('.slds-carousel__panels') }
    get panels(){ return this.template.querySelectorAll('.slds-carousel__panel') }
    get selects(){ return this.template.querySelectorAll('select') }

    previous(){
        
        if(this.active - 1 < 0){ return console.log('at start') }
        
        this.active--

        this.switchPanels()
    }

    switchPanels(){

        this.panels.forEach(el => {
        
            if(el.classList.contains(`panel_${this.active}`)){
                el.classList.add('active')
                el.classList.remove('hidden')
            }
            else {
                el.classList.remove('active')
                el.classList.add('hidden')
            }
        })
    }
    
    next(){
        if(this.active + 1 === this.max){ 

            const detail = this.getDetails()
            console.log('this.getDetails()')
            console.log(detail)
            return this.dispatchEvent(new CustomEvent('save', { detail }))
        }
        this.active++
        this.switchPanels()
    }
    activate(el){ 
        el.classList.add('active')
        el.classList.remove('hidden')
    }
    deactivate(el){ 
        el.classList.remove('active')
        el.classList.add('hidden')
    }
    

    getDetails(){
        return Array.from(this.selects).map(el => {
            return {
                documentId: el.name,
                category: el.value,
            }
        })
    }

    renderedCallback(){

        if(this.init){ return console.log('has ran')}
        
        this.files.map((file, index) => {

            const div = document.createElement('div')
            div.classList.add(`slds-carousel__panel`, `panel_${index}`)

            if(index === 0){
                this.activate(div)
            }
            else {
                this.deactivate(div)
            }
            
            const img = document.createElement('img')
            img.src = file.url
            img.title = file.title
            if(this.width){ img.style.width = this.width }
            if(this.height){ img.style.height = this.height }
            div.appendChild( img )

            this.container.appendChild( div )
        })

        this.init = true
    }
}