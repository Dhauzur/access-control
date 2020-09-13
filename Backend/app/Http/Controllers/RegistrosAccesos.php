<?php

// require 'vendor/autoload.php';
namespace App\Http\Controllers;

# imports the Google Cloud client library
use Google\Cloud\Vision\V1\ImageAnnotatorClient;
use App\AccessRecord;
use Illuminate\Http\Request;

class RegistrosAccesos extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($reg)
    {
        return "HOLAAA ".$reg;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
      # instantiates a client
      $imageAnnotator = new ImageAnnotatorClient();

      # the name of the image file to annotate
      $fileName = 'public/image_5.jpg';

      # prepare the image to be annotated
      $image = file_get_contents($fileName);

      # performs label detection on the image file
      $response = $imageAnnotator->labelDetection($image);
      $labels = $response->getLabelAnnotations();

      if ($labels) {
          echo("Labels:" . PHP_EOL);
          foreach ($labels as $label) {
              echo($label->getDescription() . PHP_EOL);
          }
      } else {
          echo('No label found' . PHP_EOL);
      }
      # [END vision_quickstart]
      return $labels;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

      //return $request->input('id');
      // $this->eliminar($request->input('id'));
  		// $file = $request->file('imagenProducto');
  		// $busquedaAtributos = explode(".", $file->getClientOriginalName());
      // $producto = Producto::where('id',$request->input('id'))->get()->first();
  		// if(count($busquedaAtributos) != 2)
  		// {
  		// 	return 'Debe exitir un solo punto "." en el nombre del archivo';
  		// }
  		// if($busquedaAtributos[1] && $producto !== null)
      // {
      //   $producto->nombreImagen = $file->getClientOriginalName();
    	// 	$producto->nombreImagenExtension = $busquedaAtributos[1];
    	// 	$producto->update();
      // }
      //
  		// try {
  		// 	\Storage::put(Auth::id().'/'.$producto->id.'-'.$producto->nombreImagen, \File::get($file));
      //   Log::info("Guardado imagen");
  		// 	return '1';
  		// }
  		// catch (\Exception $e) {
      //   Log::info("Guardado imagen".$e );
  		//   return $e;
  		// }

      // >>> r = requests.put('http://127.0.0.1:8001/visitor', data = {'passanger-number':'23'})
      // >>> r.text
      // r = requests.put('http://127.0.0.1:8001/visitor', files = {'number-room': '34', 'passanger-number':'24', 'state': 1, 'file': ('fotos', open('public/FotoPerfilFB_Sochamar_Aloj_Pensio.png', 'rb'))})


    }
    /**
     * Display the specified resource.
     *
     * @param  \App\RegistroAcceso  $registroAcceso
     * @return \Illuminate\Http\Response
     */
    public function show(RegistroAcceso $registroAcceso)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\RegistroAcceso  $registroAcceso
     * @return \Illuminate\Http\Response
     */
    public function edit(RegistroAcceso $registroAcceso)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\RegistroAcceso  $registroAcceso
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, RegistroAcceso $registroAcceso)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\RegistroAcceso  $registroAcceso
     * @return \Illuminate\Http\Response
     */
    public function destroy(RegistroAcceso $registroAcceso)
    {
        //
    }

    // public function eliminarImagen($id)
  	// {
  	// 	$producto = new Producto;
  	// 	$producto = Producto::where('id',$id)->get()->first();
  	// 	try {
  	// 		\Storage::delete(Auth::id().'/'.$producto->id.'-'.$producto->nombreImagen);
    //     $producto->nombreImagen = '';
    // 		$producto->update();
  	// 		return '1';
  	// 	}
  	// 	catch (\Exception $e) {
  	// 	    return '2';
  	// 	}
    //
    //
  	// 	return;
    //
  	// }

}
