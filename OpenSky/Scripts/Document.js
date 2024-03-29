﻿$(document).ready(function () {
    BuscarDocumentos();
});

//<!-- --------------------------- BUSCAR DOCUMENTOS COM FILTRO 
function BuscarDocumentos() {
    // add txtBuscar and make it POST
    var pesquisa = $("#txtBuscar").val();
    var url = "/api/DocumentAPI/" + pesquisa;
    $.get(url, null, function (data) {
        CriarLista(data);
    });
}
//<!-- --------------------------- LISTA DE DOCUMENTOS
function CriarLista(data) {
    var html = '';
    data.forEach(function (obj) {
        html += CriarHTML(obj);
    });
    $("#divDocumentList").html(html);

}

function AdicionarItem(obj) {
    var idEdit = $("#hddIdDocumentoEdicao").val();
    if (idEdit > 0) {
        $("#document_" + idEdit).hide();
    } else {
        obj.IdDocument = Math.floor((Math.random() * 100) + 30);
    }

    var html = CriarHTML(obj);

    $("#divDocumentList").prepend(html);
}

function CriarHTML(obj) {
    var titulo = obj.Title.length > 45 ? obj.Title.substring(0, 45) + "..." : obj.Title;
    var descricao = obj.Description.length > 100 ? obj.Description.substring(0, 100) + "..." : obj.Description;
    var versao = !obj.Version ? "" : obj.Version
    var modificacao = !obj.LastModification ? "" : obj.LastModification.split("-")[2].substring(0, 2) + "/" + obj.LastModification.split("-")[1] + "/" + obj.LastModification.split("-")[0]

    var html = '<div id="document_' + obj.IdDocument + '" class="row documentoDaLista">';
    html += '       <div class="form-group form-group-sm col-sm-6 col-sm-offset-3" style="margin-bottom:0">';
    html += '           <a href="#" class="list-group-item">';
    html += '           <h4 class="list-group-item-heading">' + titulo + '<small class="versao">' + versao + '</small>'
    html += !obj.LastModification ? '' : '<small class="pull-right" style = "margin-top:5px" > Modificado:' + modificacao + '</small >';
    html += '           </h4 >';
    html += '           <p class="list-group-item-text">' + descricao + '</p>';
    html += '           </a>';
    html += '       </div>';
    html += '       <div style="margin-top: 25px">';
    html += '           <button type="button" class="btn btn-sm btn-default" style="" onclick="Download(' + obj.IdDocument + ');"><i class="fa fa-download"></i></button>';
    html += '           <button type="button" class="btn btn-sm btn-default" style="" onclick="BuscarDocumento(' + obj.IdDocument + ');"><i class="fa fa-edit"></i></button>';
    html += '           <button type="button" class="btn btn-sm btn-default" style="" onclick="ExcluirDocumento(' + obj.IdDocument + ');"><i class="fa fa-remove"></i></button>';
    html += '       </div>';
    html += '       <span class="titulo" style="display:none">' + obj.Title + '</span>';
    html += '       <span class="descricao" style="display:none">' + obj.Description + '</span>';
    html += '       <span class="id" style="display:none">' + obj.IdDocument + '</span>';
    html += '       <span class="nomeArquivo" style="display:none">' + obj.FileName + '</span>';
    html += '   </div>';

    return html;
}
//<!-- --------------------------- BUSCAR DOCUMENTO PARA EDICAO 
function BuscarDocumento(id) {
    ToggleDivCadastro(true);
    $("#headerNovoCadastro").text("Editar Documento");
    $("#btnAdicionarDocument").text("Salvar Edição");
    $("#labelAdicionarNovoArquivo").show();
    $('#divLabelsArquivo').css("margin-top", "30px");
    $("#fileArquivo").hide();

    var titulo = $("#document_" + id).find(".titulo").text();
    var versao = $("#document_" + id).find(".versao").text();
    var descricao = $("#document_" + id).find(".descricao").text();

    $("#hddIdDocumentoEdicao").val(id);
    $("#txtTitulo").val(titulo);
    $("#txtDescricao").val(descricao);
    $("#txtVersao").val(versao);
    $("#fileArquivo").val("");
}
//<!-- --------------------------- SALVAR DOCUMENTO
function SalvarDocumento() {
    if (!ValidarCampos())
        return

    var id = $("#hddIdDocumentoEdicao").val();

    var dados = {
        IdDocument: $("#hddIdDocumentoEdicao").val(),
        Title: $("#txtTitulo").val(),
        Description: $("#txtDescricao").val(),
        Version: $("#txtVersao").val(),
    };

    //var url = "/api/DocumentAPI";
    //$.post(url, dados, function (data) {
    //    CriarLista(data);
    //    if (dados.IdDocument > 0) {
    //        Notificacao("Edição salva com sucesso!", "#c3fbbc", true);
    //    } else {
    //        Notificacao("Documento salvo com sucesso!", "#c3fbbc", true);
    //    }
    //});
    AdicionarItem(dados);
    if (id > 0) {
        Notificacao("Edição salva com sucesso!", "#c3fbbc", true);
    } else {
        Notificacao("Documento salvo com sucesso!", "#c3fbbc", true);
    }
    LimparCampos();
    ToggleDivCadastro();
};
//<!-- --------------------------- DOWNLOAD

function Download(id) {
    Notificacao("Operação não implementada!", "#f4b2b2");
}
//<!-- --------------------------- DELETE
function ExcluirDocumento(id) {
    $("#hddIdDocumentoEdicao").val(id);
    Notificacao("Documento excluído com sucesso!", "#c3fbbc", true);
    $("#document_" + id).slideUp();
    window.setTimeout(function () { CompletarExclusao(id) }, 5000);
}

function CompletarExclusao(id) {
    if (!exclusaoCancelada) {
        $.ajax({
            url: "/api/DocumentAPI/" + id,
            type: 'Delete',
            success: function (data) {
                CriarLista(data);
            },
            error: function (data) {
                Notificacao("Ocorreu um erro ao tentar excluir o documento!", "#f4b2b2");
            }
        });
    }
    $("#hddIdDocumentoEdicao").val(0);
}
var exclusaoCancelada = false;
function CancelarExclusao() {
    exclusaoCancelada = true
    var id = $("#hddIdDocumentoEdicao").val();
    $("#document_" + id).slideDown();
    Notificacao("Exclusão cancelada com sucesso!", "#c3fbbc", false);
}
//<!-- --------------------------- VALIDAR CAMPOS
function ValidarCampos() {
    if ($("#txtTitulo").val() == "") {
        Notificacao("O título é obrigatório!", "#f4b2b2");
        return false;
    } else {
        $('#navbar-notification').slideUp();
    }

    if ($("#txtDescricao").val() == "") {
        Notificacao("A descrição é obrigatória!", "#f4b2b2");
        return false;
    } else {
        $('#navbar-notification').slideUp();
    }
    if ($("#hddIdDocumentoEdicao").val() == "") {
        if ($('#fileArquivo').get(0).files.length == 0) {
            Notificacao("O arquivo é obrigatório!", "#f4b2b2");
            return false
        } else {
            $('#navbar-notification').slideUp();
        }
    }
    return true;
}

function Pesquisa() {
    window.setTimeout(function () { BuscarDocumentos() }, 1300);
}
//<!-- --------------------------- DIVERSOS

function Notificacao(descricao, cor, excluindoDoc = false) {
    $("#spnNotificacao").text(descricao);
    $("#navbar-notification").css("background-color", cor);
    $('#navbar-notification').slideDown().delay(5000).slideUp();
    if (excluindoDoc)
        $("#btnCancelarExclusao").show();
    else
        $("#btnCancelarExclusao").hide();

}

function ToggleDivCadastro(editando = false) {
    if (editando)
        $('#divDocInfo').slideDown();
    else {
        $('#divDocInfo').slideToggle();
    }
    LimparCampos();
}

function ToggleInputArquivo() {
    if ($("#chkAdicionarNovoArquivo").prop("checked")) {
        $('#fileArquivo').slideDown();
        $('#divLabelsArquivo').css("margin-top", "0");
    } else {
        $('#fileArquivo').slideUp();
        $('#divLabelsArquivo').css("margin-top", "30px");
    }
}

function LimparCampos() {
    $("#headerNovoCadastro").text("Cadastrar Novo Documento");
    $("#btnAdicionarDocument").text("Cadastrar Documento");
    $("#labelAdicionarNovoArquivo").hide();
    $("#fileArquivo").show();
    $('#divLabelsArquivo').css("margin-top", "0");

    $("#chkAdicionarNovoArquivo").prop("checked", "");
    $("#hddIdDocumentoEdicao").val("");
    $("#txtTitulo").val("");
    $("#txtDescricao").val("");
    $("#txtVersao").val("");
    $("#fileArquivo").val("");
    $("#btnCancelarExclusao").hide();
}