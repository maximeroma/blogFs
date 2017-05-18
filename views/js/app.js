$(document).ready(function(){


	// en appuyant sur le boutton envoyer j'affiche les titres dans le tableau de configuration 
	//	+ les bouttons modifier et supprimer 

	
		$.ajax({
			url:'/configurerBlog',
			method : 'POST',
		}).done(function(data){
			var articles = data;
			console.log(articles);
			$('#dynamicTable tbody').children().remove();
			for (var i = 0; i < articles.length; i++){
				$('#dynamicTable tbody').append('<tr></tr>');
				$('tr').last().append('<td>'+ articles[i].titre +'<td>')
								.append('<button class="btn btn-default delete" data-id="' + articles[i].uuid + '">X</button>')
								.append('<button class="btn btn-info update" data-id="' + articles[i].uuid + '">M</button>');
			}	
		});	

		
		

		$('tbody').delegate( '.delete', 'click', function(){
			//console.log($(this).data('id'))
			$data = $(this).data("id");
			console.log($data);
			$.ajax({
				url: '/deleteArticle',
				method : 'POST',
				data : {
					data : $data,
				},
			}).done(function(data){
				console.log(data);
			})
		})

		$('tbody').delegate('.update', 'click', function(){
			$data = $(this).data("id");
			$.ajax({
				url: '/needUpdate',
				method: 'POST',
				data : {
					data : $data,
				},
			}).done(function(data){
				console.log(data);
				$('#inputTitreArticleModif').val(data.titre);
				$('#contenuArticleModif').val(data.article);
				$('#buttonEnvoyerModif').attr('data-id', data.uuid);
			});
		});

		$('#formModif').submit(function(e){
			e.preventDefault();
			$titre = $('#inputTitreArticleModif').val();
			$article = $('#contenuArticleModif').val();
			$id = $('#buttonEnvoyerModif').data("id");
			$.ajax({
				url : '/updateArticle',
				method: 'POST',
				data : {
					titre : $titre,
					article : $article,
					uuid : $id,
				},
			}).done(function(data){
				if (data === 'ok'){
					$('#inputTitreArticleModif').val('');
					$('#contenuArticleModif').val('');
					$('#buttonEnvoyerModif').removeAttr('data-id');
				}
			})
		})

		$('.article').click(function(){
			$id = $(this).data("id");
			$.ajax({
				url : '/getArticle',
				method : 'POST',
				data : {
					uuid : $id,
				}
			});
		})	

});