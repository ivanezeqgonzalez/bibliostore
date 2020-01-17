import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import Spinner from "../layout/Spinner";
import FichaSuscriptor from "../suscriptores/FichaSuscriptor";

class PrestamoLibro extends Component {
    state = {
        noResultados: false,
        busqueda: '',
        resultado: {}
    }
    
    buscarAlumno = e => {
        e.preventDefault();
        const { busqueda } = this.state;
        const { firestore } = this.props;
        const collection = firestore.collection('suscriptores');
        const consulta = collection.where('codigo', "==", busqueda).get();
        consulta.then(resultado => {
            if(resultado.empty) {
                this.setState({
                    noResultados: false,
                    resultado: {}
                })
            } else {
                const datos = resultado.docs[0];
                this.setState({
                    noResultados: false,
                    resultado: datos.data()
                })
            }
        })
    }

    //almacenar los datos  del alumno para solicitar el libro
    solicitarPrestamo = () => {
        const suscriptor = this.state.resultado;
        //const libroActulizado = this.props.libro;
        const { firestore, history, libro: libroActulizado} = this.props;

        suscriptor.fecha_solicitud = new Date().toLocaleDateString();

        libroActulizado.prestados.push(suscriptor);

        firestore.update({
            collection: 'libros',
            doc: libroActulizado.id
        }, libroActulizado)
        .then( history.push('/') );
    }

    leerDato = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        const { libro } = this.props;
        
        if(!libro) return <Spinner />
        
        const { noResultados, resultado } = this.state;

        let fichaAlumno, btnSolicitar;
        if(resultado.nombre) {
            fichaAlumno = <FichaSuscriptor 
                alumno={resultado}
            />
            btnSolicitar = <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={this.solicitarPrestamo}
            >Solicitar Prestamo</button>
        } else {
            fichaAlumno = null;
            btnSolicitar = null;
        }
        return (
            <div className="row">
                <div className="col-12 mb-4">
                    <Link
                        to={'/'} className="btn btn-secondary">
                        <i className="fas fa-arrow-circle-left"></i> {''}
                        Volver al listado
                    </Link>
                </div>
                <div className="col-12">
                    <h2>
                        <i className="fas fa-book"></i> {''}
                        Solicitar Prestamo de Libro: {libro.titulo}
                    </h2>
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <form
                                onSubmit={this.buscarAlumno}
                                className="mb-4"
                            >
                                <legend className="color-primary text-center mt-5">
                                    Buscá el Suscriptor por Código
                                    </legend>
                                <div className="form-group">
                                    <input 
                                        type="text"
                                        name="busqueda"
                                        className="form-control"
                                        onChange={this.leerDato}
                                        />
                                </div>
                                <input 
                                    type="submit"
                                    value="Buscar Alumno"
                                    className="btn btn-success btn-block"
                                    />
                            </form>
                            {fichaAlumno}
                            {btnSolicitar}
                        </div>
                    </div>
                </div>
            </div>    
        )
    }
}

PrestamoLibro.propTypes = {
    firestore: PropTypes.object.isRequired
}
 
export default compose(
    firestoreConnect(props => [
        {
            collection: 'libros',
            storeAs: 'libro',
            doc: props.match.params.id
        }
    ]), 
    connect(({ firestore: { ordered }}, props ) => ({
        libro: ordered.libro && ordered.libro[0]
    }))
)(PrestamoLibro)