import { useLocation } from "react-router-dom";
import axiosInstance from "../services/axios";
class CustomServerLinkTool {
    
    static get isInline() {
      return true;
    }
  
    static get type() {
      return 'text';
    }
    
    constructor({api}) {
      this.api = api;
      this.button = null;
      this._state = false;
    }
    
    render() {
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.button.innerHTML = CustomServerLinkTool.toolbox.icon;
      this.button.classList.add(this.api.styles.inlineToolButton);
      
      return this.button;
    }
    
    surround(range) {
      if (!range) {
        return;
      }
      
      const selectedText = range.extractContents();
      const selectedTextContent = selectedText.textContent || selectedText.innerText;
      const currentPath = window.location.pathname;  // 여기서 현재 경로를 가져옵니다.
      console.log("Current Path: ", currentPath);
      const id = currentPath.split('/').pop();
      console.log("===================")
      console.log(id)
      // 서버에서 링크 가져오기
      this.fetchLinkFromServer(selectedTextContent,id).then(link => {
        const element = document.createElement('a');
        element.href = window.location.origin + "/page/view/" + link;
        element.target = '';
        
        element.classList.add("text-[25px]")
        element.classList.add("flex")
        element.classList.add("items-center")
        element.classList.add("gap-[10px]")
        const pageIcon = document.createElement("img")
        pageIcon.src="/images/children-icon.png"

        element.addEventListener('click', (event) => {
            event.preventDefault();  
            window.location.href = element.href;  
        });
        element.appendChild(pageIcon);
        element.appendChild(selectedText);
        range.insertNode(element);
        
      });
    }
    
    async fetchLinkFromServer(selectedTextContent,id) {
      try {
        const response = await axiosInstance.post('/api/page/children',{
            selectedTextContent,
            id
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching link:', error);
        return '#';
      }
    }
  
    checkState(selection) {
      const text = selection.anchorNode;
      
      if (!text) {
        return;
      }
      
      const anchorElement = text instanceof Element ? text : text.parentElement;
      this._state = !!anchorElement.closest('a');
    }
  
    static get sanitize() {
      return {
        a: {
          href: true,
          target: '',
          rel: 'noopener noreferrer'
        },
        img: {
            src: true,  // 이미지의 src 속성 허용
            alt: true    // 이미지의 alt 속성 허용
        }
      };
    }
  
    static get toolbox() {
      return {
        title: 'Server Link',
        icon: '<img class="w-[19px] h-[19px]" src="/images/children-icon.png"></img>'
      };
    }
  }
  
  export default CustomServerLinkTool;