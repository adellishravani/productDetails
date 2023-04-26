import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import SimilarProductItem from '../SimilarProductItem'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  onprogress: 'ONPROGRESS',
}

class ProductItemDetails extends Component {
  state = {productData: [], apistatus: apiConstants.initial, num: 0}

  componentDidMount() {
    this.productitemData()
  }

  productitemData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token'),
   
   const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    },

    const response = fetch(`https://apis.ccbp.in/products/${id}`, options)

    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedData = {
        similarData: fetchedData.similar_products,
        imageUrl: fetchedData.image_url,
        id: fetchedData.id,
        title: fetchedData.title,
        brand: fetchedData.brand,
        totalreviews: fetchedData.total_reviews,
        rating: fetchedData.rating,
        availability: fetchedData.availability,
        price: fetchedData.price,
        description: fetchedData.description,
      }

      this.setState({productData: updatedData, apistatus: apiConstants.success})
    } else if (response.status === 401) {
      this.setState({apistatus: apiConstants.failure})
    }
  }

  minus = () => {
    this.setState(prevState => ({
      num: prevState.num - 1,
    }))
  }

  plus = () => {
    this.setState(prevState => ({
      num: prevState.num - 1,
    }))
  }

  renderproductDetails = () => {
    const {productData, num} = this.state
    const {
      availability,
      rating,
      totalreviews,
      brand,
      title,
      similarData,
      imageUrl,
      description,
      price,
    } = productData

    similarData.map(each => ({
      id: each.id,
      imageUrl: each.image_url,
      title: each.title,
      style: each.style,
      price: each.price,
      description: each.description,
      brand: each.brand,
      totalReviews: each.total_reviews,
      rating: each.rating,
      availability: each.availability,
    }))

    return (
      <div className="divv">
        <img src={imageUrl} alt={title} className="image" />
        <div>
          <h1>{title}</h1>
          <p>Rs.{price}/-</p>
          <p>{rating}</p>
          <p>{totalreviews}</p>
          <p>{description}</p>
          <p>Availability:{availability}</p>
          <p>Brand:{brand}</p>
          <div>
            <button type="button" onClick={this.minus}>
              -
            </button>
            <p>{num}</p>
            <button type="button">+</button>
          </div>
          <button type="button" onClick={this.plus}>
            Add to Cart
          </button>
        </div>
        <ul>
          <similarProductItem similarDetails={productData.similarData} />
        </ul>
      </div>
    )
  }

  loadingView = () => {
    ;<div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  }

  renderfailureview = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
      />
      <h1>Product Not Found</h1>
      <button type="button">Continue shopping</button>
    </div>
  )

  render() {
    const {apistatus} = this.state
    switch (apistatus) {
      case apiConstants.success:
        return this.renderproductDetails()
      case apiConstants.failure:
        return this.renderfailureview()
      case apiConstants.onprogress:
        return this.loadingView()

      default:
        return null
    }
  }
}

export default ProductItemDetails
