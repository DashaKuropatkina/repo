class View {
    constructor() {
        this.app = document.getElementById('app');

        this.title = this.createElement('h1', 'title');
        this.title.textContent = 'GitHub Search Repositories';

        this.searchLine = this.createElement('div', 'search-line');
        this.searchInput = this.createElement('input', 'search-input');
        this.searchCounter = this.createElement('span', 'counter');
        this.searchLine.append(this.searchInput);
        this.searchLine.append(this.searchCounter);

        this.repoWrapper = this.createElement('div', 'repo-wrapper');
        this.repoList = this.createElement('ul', 'repo');
        this.repoWrapper.append(this.repoList);

        this.main = this.createElement('div', 'main');
        this.main.append(this.repoWrapper);

        this.app.append(this.title);
        this.app.append(this.searchLine);
        this.app.append(this.main);
    }

    createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag);
        if(elementClass) {
            element.classList.add(elementClass);
        }
        return element;
    }

    createRepo(repoData) {
        const repoElement = this.createElement('li', 'repo-prev');
        repoElement.innerHTML = `<a class="repo-prev-url" href="${repoData.repos_url}" onclick="window.open("${repoData.repos_url}", null, "width=700, height=500"); return false; target="_blank"">${repoData.repos_url}</a>
                                 <span class="repo-prev-name">Name: ${repoData.login}</span>
                                 <span class="repo-prev-type">Type: ${repoData.type}</span>`;
        this.repoList.append(repoElement);                        
    }
}

class Search {
    constructor(view) {
        this.view = view;

        this.view.searchInput.addEventListener('keyup', this.debounce(this.searchRepo.bind(this), 500));

    }

    async searchRepo() {
        return await fetch(`https://api.github.com/search/users?q=${this.view.searchInput.value}&per_page=10`).then((res) => {
            if(res.ok) {
                res.json().then(res => {
                    res.items.forEach(repo => this.view.createRepo(repo))
                }) 
            } else {
                    
            }
        })
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

new Search(new View());
