import React from 'react';
import { handleResponse } from '../../Helper';
import { API_URL } from '../../config';
import Loading from '../common/Loading';
import Table from './Table';
import Pagination from './Pagination';

class List extends React.Component {
    constructor(){
        super();

        this.state = {
            loading: false,
            currencies: [],
            error: null,
            totalPages: 0,
            page: 1,
        };
        this.handlePaginationClick = this.handlePaginationClick.bind(this);
    }


    componentDidMount() {
        this.fetchCurrencies();
    }

    fetchCurrencies() {
        this.setState({ loading: true });

        const {page} = this.state;

        fetch(`${API_URL}/cryptocurrencies?page=${page}&perPage=20`)
        .then(handleResponse)
        .then((data) => {
            const { currencies, totalPages } = data;

            this.setState({
               currencies,
               totalPages,
               loading: false,
            });
        })
        .catch((error) => {
            this.setState({
                error: error.errorMassage,
                loading: false,
            });
        });
    }

   

    handlePaginationClick(direction,){
        let nextPage = this.state.page;
        

        // increment nextPage if direction is 'next', otherwise decrement it
        nextPage = direction === 'next' ? nextPage + 1 : nextPage - 1;
        this.setState({ page: nextPage }, () => {
            // call fetchCurrencies function inside setState's callBack
            // because we have to make sure first page state is updated
            this.fetchCurrencies();
        });
}

    render() {
        const { loading, error, currencies, page, totalPages } = this.state;

        // render only loading component, if loading state is set to true
      if (loading) {
          return <div className="loading-container"><Loading /></div>
      }

      // render only error message, if error occurred while fetching data
      if (error){
          return <div className="error">{error}</div>
      }

        return (
          <div>
            <Table
             currencies={currencies} 
            />
            <Pagination
              page={page}
              totalPages={totalPages}
              handlePaginationClick={this.handlePaginationClick}
            />
          </div>
        );
    }
}

export default List;