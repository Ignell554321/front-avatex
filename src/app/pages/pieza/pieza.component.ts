import { Component, OnInit } from '@angular/core';
import { PiezaModule } from 'src/app/models/pieza.module';
import { PiezaService } from 'src/app/service/pieza.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalProductoComponent } from '../modal-producto/modal-producto.component';
import { ProductoModule } from 'src/app/models/producto.module';

@Component({
  selector: 'app-pieza',
  templateUrl: './pieza.component.html',
  styleUrls: ['./pieza.component.css']
})
export class PiezaComponent implements OnInit {

  constructor(public service:PiezaService,private formBuilder: FormBuilder,private modalService: BsModalService) { 

    this.frmPieza= this.formBuilder.group({
      id: [''],
      metraje: [0,Validators.required],
      color: ['',Validators.required],
      ubicacion: ['',Validators.required],
      fecha: [new Date,Validators.required],
      producto: this.formBuilder.group({

        id: [''],
        nombre: ['',Validators.required],
        descripcion: ['',Validators.required],
        costo: [0,Validators.required]
      })
    })



  }

  
  public registro:boolean=false;
  public frmPieza: FormGroup;
  public modalRef: BsModalRef | undefined;
  public producto:ProductoModule | undefined;

  public prev:number=0
  public last:number=0
  public current:number=0
  public page:number=1
  public tamanio:number=10
  public paginas:number[]=[]
  public tamaniosPaginado:number[]=[10,30,50]

  ngOnInit(): void {

    
    this.obtenerPaginado(this.page)

  
  }

  public onChangeMostrar(tamanio:any) {
    this.tamanio=tamanio
    this.obtenerPaginado(this.page)

}

  public obtenerPaginado(pagina:number){

    this.page=pagina
    this.current=pagina
    this.prev=pagina-1
    this.paginas=[]

    this.service.listarPaginas(pagina-1,this.tamanio).subscribe(res=>{
    
    this.last=res.totalPages as number
    this.service.piezas=res.content as  PiezaModule[];

      for (let i=0; i < this.last; i++){
        this.paginas.push(i+1)
      }
      
    });

  }


  public listarPiezas(){

    this.service.listarPiezas().subscribe(res=>{
      this.service.piezas=res as  PiezaModule[];
      console.log(res);
    });

  }

  public editarPieza(pieza:PiezaModule){

    this.service.buscarPieza(pieza.id).subscribe(res=>{
      console.log(res)
      this.registro=true
      this.frmPieza.patchValue(res)
    })

  }

  public cargarModalProducto(){

    this.modalRef = this.modalService.show(ModalProductoComponent,  {
      initialState: {
        piezaComponent:this
      }
    });

  }

  public nuevaPieza(){
    this.registro=true
  }


  public buscar(){
    
  }

  public cancelar(){
    this.registro=false
  }

  public guardarPieza(){

    if(this.frmPieza.valid){

      console.log(this.frmPieza.value)
      this.service.ingresarPieza(this.frmPieza.value).subscribe(res=>{

        
          Swal.fire('Exito', 'Producto Registrado Correctamente!', 'success').then((result)=>{ if (result.isConfirmed) {
            this.frmPieza.reset()
            this.listarPiezas()
            this.registro=false  }})
         
          
      })

    }else{
      Swal.fire('Error', 'Debes completar el formulario. Verifique por favor.', 'error')
    }
    

  }

  public eliminarPieza(pieza:PiezaModule){

    Swal.fire({
      title: 'Deseas eliminar esta pieza?',
      text: "No podras volver a visualizar este registro",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminalo'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Eliminado!',
          'La pieza se ha eliminado correctamente.',
          'success'
        )
      }
    })

  }


}
